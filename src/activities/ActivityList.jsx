import { useState } from "react";
import { deleteActivity, getActivities } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

export default function ActivityList({ activities, setActivities }) {
  const { token } = useAuth();
  const [deleteErrors, setDeleteErrors] = useState({});

  async function handleDelete(token, id) {
    try {
      await deleteActivity(token, id);
      // If delete succeeds deleteErrors will be null
      setDeleteErrors((oldErrors) => ({...oldErrors, [id]: null}));

      const newActivites = await getActivities();
      setActivities(newActivites);
    } catch (error) {
      setDeleteErrors((oldErrors) => ({
        ...oldErrors,
        [id]: "You must be the same user who created this activity to perform this action",
      }));
    }
  }

  return (
    <ul>
      {activities.map((activity) => (
        <div key={activity.id}>
          <li>{activity.name}</li>

          {token && (
            <>
              <button onClick={() => handleDelete(token, activity.id)}>Delete</button>
              {deleteErrors[activity.id] && (
                <p style={{ color: "red" }}>{deleteErrors[activity.id]}</p>
              )}
            </>
          )}

        </div>
      ))}
    </ul>
  );
}
