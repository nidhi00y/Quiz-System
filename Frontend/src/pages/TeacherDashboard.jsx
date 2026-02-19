import { useNavigate } from "react-router-dom";
import ERPLayout from "../components/ERPLayout";
import ERPTile from "../components/ERPTile";

function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-3 text-center">
          <ERPTile
            icon="📤"
            title="Upload Question Bank"
            onClick={() => navigate("/teacher/upload-questions")}
          />
        </div>

        <div className="col-md-3 text-center">
          <ERPTile
            icon="🗓️"
            title="Schedule Quiz"
            onClick={() => navigate("/teacher/schedule-quiz")}
          />
        </div>

        <div className="col-md-3 text-center">
          <ERPTile
            icon="📊"
            title="View Results"
            onClick={() => navigate("/teacher/view-results")}
          />
        </div>
      </div>
    </ERPLayout>
  );
}


export default TeacherDashboard;
