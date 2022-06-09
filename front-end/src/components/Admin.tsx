import { reset } from "../api";

function Admin() {
  return (
    <div className="admin">
      <button id="reset" className="btn btn--red" onClick={reset}>
        Reset DB
      </button>
    </div>
  );
}

export default Admin;
