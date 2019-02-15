class Types::ClassroomType < Types::BaseObject
  graphql_name 'Classroom'

  field :id, ID, null: false
  field :name, String, null: false
  field :teacher, String, null: false

  field :assignments, [ClassroomAssignmentType], null: false

  def assignments
    ActiveRecord::Base.connection.execute(
      "SELECT unit.name,
       activity.name,
       activity.description,
       activity.repeatable,
       activity.activity_classification_id,
       unit.id AS unit_id,
       ua.id AS ua_id,
       unit.created_at AS unit_created_at,
       unit.name AS unit_name,
       cu.id AS ca_id,
       COALESCE(cuas.completed, 'f') AS marked_complete,
       ua.activity_id,
       MAX(acts.updated_at) AS act_sesh_updated_at,
       ua.due_date,
       cu.created_at AS unit_activity_created_at,
       COALESCE(cuas.locked, 'f') AS locked,
       COALESCE(cuas.pinned, 'f') AS pinned,
       MAX(acts.percentage) AS max_percentage,
       SUM(CASE WHEN acts.state = 'started' THEN 1 ELSE 0 END) AS resume_link
    FROM unit_activities AS ua
    JOIN units AS unit ON unit.id = ua.unit_id
    JOIN classroom_units AS cu ON unit.id = cu.unit_id
    LEFT JOIN activity_sessions AS acts ON cu.id = acts.classroom_unit_id AND acts.activity_id = ua.activity_id AND acts.visible = true
    AND acts.user_id = #{context[:current_user].id}
    JOIN activities AS activity ON activity.id = ua.activity_id
    LEFT JOIN classroom_unit_activity_states AS cuas ON ua.id = cuas.unit_activity_id
    AND cu.id = cuas.classroom_unit_id
    WHERE #{context[:current_user].id} = ANY (cu.assigned_student_ids::int[])
    AND cu.classroom_id = #{object[:id]}
    AND cu.visible = true
    AND unit.visible = true
    AND ua.visible = true
    GROUP BY unit.id, unit.name, unit.created_at, cu.id, activity.name, activity.activity_classification_id, activity.id, activity.uid, ua.due_date, ua.created_at, unit_activity_id, cuas.completed, cuas.locked, cuas.pinned, ua.id

    ORDER BY pinned DESC, locked ASC, max_percentage DESC, ua.due_date ASC, unit.created_at ASC, ua.id ASC").to_a
  end
end