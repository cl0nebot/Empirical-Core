class Types::ClassroomType < Types::BaseObject
  graphql_name 'Classroom'

  field :id, ID, null: false
  field :name, String, null: false
  field :teacher, String, null: false

end