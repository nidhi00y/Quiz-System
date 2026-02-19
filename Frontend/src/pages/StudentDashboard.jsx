import { useNavigate } from "react-router-dom";
import ERPLayout from "../components/ERPLayout";
import ERPTile from "../components/ERPTile";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-3 text-center">
          <ERPTile
            icon="📝"
            title="Attempt Quizzes"
            onClick={() => navigate("/student/quizzes")}
          />
        </div>

        <div className="col-md-3 text-center">
          <ERPTile
            icon="📊"
            title="View Results"
            onClick={() => navigate("/student/results")}
          />
        </div>
      </div>
    </ERPLayout>
  );
}

export default StudentDashboard;
