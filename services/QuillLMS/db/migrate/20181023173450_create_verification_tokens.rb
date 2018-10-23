class CreateVerificationTokens < ActiveRecord::Migration
  def change
    create_table :verification_tokens do |t|
      t.integer :user_id
      t.text :token
      t.text :email_verified
      t.boolean :verified

      t.timestamps null: false
    end
  end
end
