class Types::ClassroomAssignmentType < Types::BaseObject
  graphql_name 'ClassroomAssignment'

  field :name, String, null: false
  field :description, String, null: true
  field :repeatable, Boolean, null: false
  field :activity_classification_id, Int, null: false
  field :unit_id, Int, null: false
  field :ua_id, Int, null: false
  field :unit_created_at, Int, null: false
  field :unit_name, String, null: false
  field :ca_id, Int, null: false
  field :marked_complete, Boolean, null: false
  field :activity_id, Int, null: false
  field :act_sesh_updated_at, Int, null: false
  field :due_date, Int, null: true
  field :unit_activity_created_at, Int, null: false
  field :locked, Boolean, null: false
  field :pinned, Boolean, null: false
  field :max_percentage, String, null: true
  field :resume_link, String, null: true

end