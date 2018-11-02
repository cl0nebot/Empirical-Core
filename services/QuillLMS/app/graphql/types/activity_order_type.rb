class Types::ActivityOrderType < Types::BaseObject
  field :id, ID, null: false
  field :activity_id, ID, null: false
  field :order_number, Int, null: true
end