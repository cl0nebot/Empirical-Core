class ProgressReports::DistrictConceptReports
  attr_reader :admin_id

  def initialize(admin_id)
    @admin_id = admin_id
  end

  def results
    # Uncomment the line below, and comment out the active record line
    # in order to bypass the database while testing
    # [{"school_name"=>"Hogwarts", "teacher_name"=>"Severus Snape", "classroom_name"=>"Potions III", "student_name"=>"Ron Weasley", "correct"=>"15", "incorrect"=>"8", "percentage"=>"65"}]
    teacher_ids = ActiveRecord::Base.connection.execute("
      SELECT
        teachers.id
      FROM schools_admins
      JOIN schools ON schools.id = schools_admins.school_id
      JOIN schools_users on schools_users.school_id = schools.id
      JOIN users AS teachers on teachers.id = schools_users.user_id
      WHERE schools_admins.user_id = #{@admin_id}
    ").to_a.map { |id| id["id"] }
    results = []
    teacher_ids.each do |id|
      results.push(ActiveRecord::Base.connection.execute(query(id)).to_a)
    end
    results.flatten
  end

  private

  def query(teacher_id)
    <<~SQL
    WITH results AS (
    SELECT
          schools.name AS school_name,
          teachers.name AS teacher_name,
          classrooms.name AS classroom_name,
          students.name AS student_name,
          students.id AS student_id,
          SUM( CAST(concept_results.metadata->>'correct' as INT)) as correct,
          COUNT(concept_results) as concept_results_count
        FROM schools_admins
        JOIN schools ON schools.id = schools_admins.school_id
        JOIN schools_users on schools_users.school_id = schools.id
        JOIN users AS teachers on teachers.id = schools_users.user_id
        JOIN classrooms_teachers ON classrooms_teachers.user_id = teachers.id AND classrooms_teachers.role = 'owner'
        JOIN classrooms ON classrooms.id = classrooms_teachers.classroom_id
        JOIN classroom_units ON classroom_units.classroom_id =
          classrooms.id
        JOIN activity_sessions ON activity_sessions.classroom_unit_id =
          classroom_units.id
        JOIN users AS students ON students.id = activity_sessions.user_id
        JOIN concept_results ON concept_results.activity_session_id =
          activity_sessions.id
        WHERE schools_admins.user_id = #{@admin_id}
        AND teachers.id = #{id}
        GROUP BY student_id, teacher_name, classroom_name, school_name
    )
    SELECT
      school_name,
      teacher_name,
      classroom_name,
      student_name,
      correct,
      (concept_results_count - correct) as incorrect,
      FLOOR(( correct/concept_results_count::float ) * 100 ) as percentage
    FROM results;
    SQL
  end

end
