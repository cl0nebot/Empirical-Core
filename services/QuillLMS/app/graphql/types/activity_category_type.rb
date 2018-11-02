class Types::ActivityCategoryType < Types::BaseObject
  graphql_name 'ActivityCategory'

  field :id, ID, null: false
  field :name, String, null: false
  field :order_number, Int, null: false

  field :activities, [Types::ActivityType], null: false

  def activities 
    return object.activities.where(flags: ["production"])
  end

  field :activity_orders, [Types::ActivityOrderType], null: false

  def activity_orders
    return object.activity_category_activities
  end

end