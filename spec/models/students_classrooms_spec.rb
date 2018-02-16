require 'rails_helper'

describe StudentsClassrooms, type: :model, redis: :true do
  it { should belong_to(:student).class_name('User') }
  it { should belong_to(:classroom).class_name("Classroom") }

  it { is_expected.to callback(:checkbox).after(:save) }  
  it { is_expected.to callback(:run_associator).after(:save) }
  it { is_expected.to callback(:invalidate_classroom_minis).after(:commit) }

  describe '#archived_classrooms_manager' do
    let(:classrooms) { create(:students_classrooms) }

    it 'should return the correct hash' do
      expect(classrooms.archived_classrooms_manager).to eq(
        {
          joinDate: classrooms.created_at.strftime("%m/%d/%Y"),
          className: classrooms.classroom.name,
          teacherName: classrooms.classroom.owner.name,
          id: classrooms.id
        })
    end
  end

  describe 'callbacks' do
    context '#checkbox' do
      let(:students_classrooms) { build(:students_classrooms) }

      it 'should find or create a checkbox' do
        expect(students_classrooms).to receive(:find_or_create_checkbox).with('Add Students', students_classrooms.classroom.owner)
        students_classrooms.save
      end
    end

    context '#run_associator' do
      let(:school_classrooms) { build(:students_classrooms, visible: true) }

      it 'should run the students to classrooms associator' do
        expect(Associators::StudentsToClassrooms).to receive(:run).with(classrooms.student, classrooms.classroom)
        students_classrooms.save
      end
    end

    context 'invalidate_classroom_minis' do
      let(:classrooms) { create(:students_classrooms) }

      it "should invalidate the classroom minis" do
        $redis.set("user_id:#{classrooms.classroom.owner.id}_classroom_minis", "something")
        classrooms.run_callbacks(:commit)
        expect($redis.get("user_id:#{classrooms.classroom.owner.id}_classroom_minis")).to eq nil
      end
    end
  end
end
