class AccountsController < ApplicationController
  before_filter :signed_in!, only: [:edit, :update]
  before_filter :set_cache_buster, only: [:new]
  before_filter :set_user, only: [:create]
  # TODO: test only! this must be removed
  skip_before_action :verify_authenticity_token

  def new
    ClickSignUpWorker.perform_async
    session[:post_sign_up_redirect] = params[:redirect]
    @teacherFromGoogleSignUp = false
    @js_file = 'session'
  end

  def role
    @js_file = 'session'
    role = params[:role]
    session[:role] = role if ['student', 'teacher'].include? role
    render json: {}
  end

  # Non-standard route for verifying email ownership
  def verify
    @success = false
    verification_token = params[:t]
    unless verification_token.blank?
      vt = VerificationToken.find_by_token(verification_token)
      unless vt.nil?
        vt.update(verified: true)
        @success = true
      end
    end
  end


  # POST request to send verification email sends a verification email to a user
  # if they are not yet verified and do exist
  def send_verification_email
    age = params[:age].to_i
    if current_user.nil? or age == 0
      render :nothing => true, :status => 400
      return
    end
    email_to_verify = params[:email]
    vt = current_user.verification_token
    unless vt.present? and vt.verified
      # create or replace verification token if needed
      if vt.nil? or vt.email_verified != email_to_verify
        current_user.verification_token = VerificationToken.create(
          token: SecureRandom.uuid(),
          email_verified: email_to_verify,
          verified: false,
          age_at_time_of_creation: age
        )
      end
      if age < 13
        VerificationMailer.parent_verification_email(current_user.verification_token,
                                                   current_user.name).deliver_now!
      else
        VerificationMailer.student_verification_email(current_user.verification_token,
                                                   current_user.name).deliver_now!
      end
    else
      # the email is already verified 
    end
    render :nothing => true, :status => 204
  end


  # creates a new user from params.
  # if a temporary_user_id is present in the session, it uses that
  # user record instead of creating a new one.
  def create
    role = params[:user].delete(:role)
    @user.attributes = user_params
    @user.safe_role_assignment(role)
    @user.validate_username = true
    if @user.save
      sign_in @user
      trigger_account_creation_callbacks
      @user.subscribe_to_newsletter
      create_referral_if_teacher_and_referrer
      render json: creation_json
    else
      render json: {errors: @user.errors}, status: 422
    end
  end

  def update
    user_params.delete(:password) unless user_params[:password].present?
    @user = current_user

    if user_params[:username] == @user.username
      validate_username = false
    else
      validate_username = true
    end

    user_params.merge! validate_username: validate_username
    if @user.update_attributes user_params
      redirect_to updated_account_path
    else
      render 'accounts/edit'
    end
  end

  def edit
    @user = current_user
  end

protected

  def user_params
    params.require(:user).permit(
                                 :account_type,
                                 :classcode,
                                 :email,
                                 :name,
                                 :password,
                                 :school_ids,
                                 :send_newsletter,
                                 :terms_of_service,
                                 :username)
  end

  def creation_json
    if session[:post_sign_up_redirect]
      { redirectPath: session.delete(:post_sign_up_redirect) }
    elsif @user.has_outstanding_coteacher_invitation?
      { redirectPath: teachers_classrooms_path }
    else
      @user
    end
  end

  def set_user
    @user = User.find_by_id(session[:temporary_user_id]) || User.new
  end

  def trigger_account_creation_callbacks
    CompleteAccountCreation.new(@user, request.remote_ip).call
  end

  def create_referral_if_teacher_and_referrer
    if @user.teacher? && request.env['affiliate.tag']
      referrer_user_id = ReferrerUser.find_by(referral_code: request.env['affiliate.tag'])&.user&.id
      ReferralsUser.create(user_id: referrer_user_id, referred_user_id: @user.id) if referrer_user_id
    end
  end



end
