class AddAgeAtTimeOfCreationToVerificationTokens < ActiveRecord::Migration
  def change
    add_column :verification_tokens, :age_at_time_of_creation, :integer
  end
end
