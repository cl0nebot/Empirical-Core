class VerificationMailer < ActionMailer::Base

  default from: 'hello@quill.org'

  def parent_verification_email(verification_token, requesting_users_name)
    @name_of_user_requesting_verification = requesting_users_name 
    mail to: verification_token.email_verified, subject: 'Verify your Quill account'
  end

end
