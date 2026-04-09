import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Taskspage.css";
import "./smallScreensTasks.css";

function Taskspage() {
  const navigate = useNavigate();
  const prevRoadmapsRef = useRef();

  const [newRoadmap, setNewRoadmap] = useState(true);
  const [viewRoadmap, setViewRoadmap] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);
  const [roadmapName, setRoadmapName] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [subTaskInput, setSubTaskInput] = useState("");
  const [sidPar, setSidPar] = useState(false);
  const [multiple, setMultiple] = useState([]);
  const [message, setMessage] = useState(false);

  // New State variables
  const [userProfile, setUserProfile] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [pendingShares, setPendingShares] = useState([]);
  const [showInvitesModal, setShowInvitesModal] = useState(false);

  const [shareEmail, setShareEmail] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    // Fetch Roadmaps
    axios.get(`http://localhost:8080/roadmaps/${userId}`)
      .then(res => {
        if (res.data) setRoadmaps(res.data);
      })
      .catch(err => console.error("Failed to fetch roadmaps", err));

    // Fetch User Profile
    axios.get(`http://localhost:8080/users/${userId}`)
      .then(res => setUserProfile(res.data))
      .catch(err => console.error("Failed to fetch profile", err));

    // Fetch Pending Shares
    axios.get(`http://localhost:8080/roadmaps/shared/${userId}`)
      .then(res => setPendingShares(res.data))
      .catch(err => console.error("Failed to fetch shares", err));
  }, [navigate]);

  useEffect(() => {
    if (roadmaps.length > 0) {
      localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
      if (prevRoadmapsRef.current && roadmaps !== prevRoadmapsRef.current) {
        roadmaps.forEach(rm => {
          const prevRm = prevRoadmapsRef.current.find(p => p.id === rm.id);
          if (prevRm && JSON.stringify(rm) !== JSON.stringify(prevRm)) {
            axios.put(`http://localhost:8080/roadmaps/${rm.id}`, rm).catch(err => console.error("Update failed", err));
          }
        });
      }
    }
    prevRoadmapsRef.current = roadmaps;
  }, [roadmaps]);

  const currentRoadmap = roadmaps.find((rm) => rm.id === currentRoadmapId);

  const recalcRoadmap = (rm) => {
    let totalItems = 0;
    let completedItems = 0;
    rm.tasks.forEach(task => {
      totalItems++;
      if (task.completed) completedItems++;
      task.subtasks.forEach(sub => {
        totalItems++;
        if (sub.completed) completedItems++;
      });
    });
    return {
      ...rm,
      percentage: totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100),
      tasksCont: rm.tasks.length,
      completedCont: rm.tasks.filter(t => t.completed).length,
      onProgress: rm.tasks.filter(t => !t.completed).length
    };
  };

  const handleProfileUpload = async () => {
    if (!profileImageFile) return;
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("image", profileImageFile);
    try {
      const res = await axios.post(`http://localhost:8080/users/${userId}/image`, formData);
      setUserProfile(prev => ({ ...prev, profile_image: res.data.profile_image }));
      setShowProfileModal(false);
    } catch (e) {
      console.error("Upload error", e);
      alert("Failed to upload image");
    }
  };

  const handleShareRoadmap = async () => {
    if (!shareEmail) return;
    const userId = localStorage.getItem("userId");
    try {
      await axios.post("http://localhost:8080/roadmaps/share", {
        roadmapId: currentRoadmapId,
        senderId: userId,
        receiverEmail: shareEmail
      });
      alert("Invite sent successfully!");
      setShowShareModal(false);
      setShareEmail("");
    } catch (e) {
      console.error("Error sending invite", e);
      alert("Error sending invite");
    }
  };

  const acceptShare = async (shareId) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post(`http://localhost:8080/roadmaps/shared/${shareId}/accept`, { userId });
      alert("Imported Roadmap Successfully!");
      setPendingShares(prev => prev.filter(s => s.share_id !== shareId));
      const freshRes = await axios.get(`http://localhost:8080/roadmaps/${userId}`);
      setRoadmaps(freshRes.data);
    } catch (e) {
      console.error(e);
      alert("Failed to accept shared roadmap.");
    }
  };

  function viewSubTasks(taskId) {
    let cpyMultiple = [...multiple];
    const index = cpyMultiple.indexOf(taskId);
    if (index === -1) cpyMultiple.push(taskId);
    else cpyMultiple.splice(index, 1);
    setMultiple(cpyMultiple);
  }

  function RoadmapDone(id) {
    setRoadmaps((prev) => prev.map((rm) => (rm.id === id ? { ...rm, completed: true } : rm)));
    setMessage(true);
  }

  function taskCompleted(taskId) {
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const updatedTasks = rm.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
      return recalcRoadmap({ ...rm, tasks: updatedTasks });
    }));
  }

  function subtaskCompleted(taskId, subTaskId) {
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const updatedTasks = rm.tasks.map(t => t.id === taskId ? {
        ...t, subtasks: t.subtasks.map(s => s.id === subTaskId ? { ...s, completed: !s.completed } : s)
      } : t);
      return recalcRoadmap({ ...rm, tasks: updatedTasks });
    }));
  }

  function viewThisRoadmap(id) {
    setCurrentRoadmapId(id);
    setNewRoadmap(false);
    setViewRoadmap(true);
  }

  async function addroadmap() {
    if (roadmapName.trim() === "") {
      alert("Enter the Roadmap Name");
      return;
    }
    const userId = localStorage.getItem("userId");
    const newRoadmap = {
      id: crypto.randomUUID(),
      userId: userId,
      name: roadmapName,
      completed: false,
      tasksCont: 0,
      completedCont: 0,
      onProgress: 0,
      percentage: 0,
      tasks: [],
    };
    try {
      await axios.post("http://localhost:8080/roadmaps", newRoadmap);
      setRoadmaps((prev) => [...prev, newRoadmap]);
      setCurrentRoadmapId(newRoadmap.id);
      setRoadmapName("");
      setViewRoadmap(true);
      setNewRoadmap(false);
    } catch {
      console.log("Inserting Roadmap error");
    }
  }

  function deleteRoadmap(e, id) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this Roadmap?")) return;
    setRoadmaps((prev) => prev.filter((rm) => rm.id !== id));
    if (currentRoadmapId === id) {
      setNewRoadmap(true);
      setViewRoadmap(false);
    }
    axios.delete(`http://localhost:8080/roadmaps/${id}`).catch(console.error);
  }

  function addTask() {
    if (taskInput.trim() === "") return;
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const newTask = { id: crypto.randomUUID(), name: taskInput, completed: false, total: 0, subCompletedCount: 0, subtasks: [] };
      return recalcRoadmap({ ...rm, tasks: [...rm.tasks, newTask] });
    }));
    setTaskInput("");
  }

  function deleteTask(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const updatedTasks = rm.tasks.filter(t => t.id !== taskId);
      return recalcRoadmap({ ...rm, tasks: updatedTasks });
    }));
  }

  function addSubTask(taskId) {
    if (subTaskInput.trim() === "") return;
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const newSub = { id: crypto.randomUUID(), name: subTaskInput, completed: false };
      const updatedTasks = rm.tasks.map(t => t.id === taskId ? { ...t, total: (t.total || 0) + 1, subtasks: [...t.subtasks, newSub] } : t);
      return recalcRoadmap({ ...rm, tasks: updatedTasks });
    }));
    setSubTaskInput("");
  }

  function deleteSubTask(taskId, subTaskId) {
    setRoadmaps((prev) => prev.map((rm) => {
      if (rm.id !== currentRoadmapId) return rm;
      const updatedTasks = rm.tasks.map(t => t.id === taskId ? { ...t, total: (t.total || 1) - 1, subtasks: t.subtasks.filter(s => s.id !== subTaskId) } : t);
      return recalcRoadmap({ ...rm, tasks: updatedTasks });
    }));
  }

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="taskpcontainer" onClick={() => { setSidPar(false); setMessage(false); }}>

      {/* HEADER NAV */}
      <header className="header-dashboard">
        <Link className="logo-box" to="/">
          <div className="logo">
            <h1>G</h1><img src="/rising.png" alt="" /><h1>R</h1>
          </div>
        </Link>
        <div className="header-actions">
          <button onClick={() => setShowInvitesModal(true)} className="invite-btn">
            Notifications ({pendingShares.length})
          </button>
          <button onClick={() => setShowProfileModal(true)} className="profile-toggle">
            {userProfile.profile_image ? (
              <img src={userProfile.profile_image} className="avatar-small" alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{userProfile.firstname?.charAt(0)}</div>
            )}
            <span className="profile-name">{userProfile.firstname}</span>
          </button>
        </div>
      </header>

      {/* MODALS */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>My Profile</h2>
            <div className="profile-details">
              {userProfile.profile_image ? (
                <img src={userProfile.profile_image} className="avatar-large" alt="Profile" />
              ) : (
                <div className="avatar-large-placeholder">{userProfile.firstname?.charAt(0)}</div>
              )}
              <h3>{userProfile.firstname} {userProfile.lastname}</h3>
              <p>{userProfile.email}</p>
            </div>
            <div className="upload-section">
              <label>Update Avatar</label>
              <input type="file" accept="image/*" onChange={(e) => setProfileImageFile(e.target.files[0])} />
              <button onClick={handleProfileUpload} className="btn-primary">Upload</button>
            </div>
            <button onClick={logout} className="logout-btn">Log Out</button>
            <button onClick={() => setShowProfileModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {showInvitesModal && (
        <div className="modal-overlay" onClick={() => setShowInvitesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Pending Invites</h2>
            {pendingShares.length === 0 ? <p>No invites pending.</p> : (
              <ul className="invites-list">
                {pendingShares.map(share => (
                  <li key={share.share_id} className="invite-item">
                    <div className="invite-sender">
                      {share.profile_image ? (
                        <img src={share.profile_image} className="avatar-small" alt="" />
                      ) : (
                        <div className="avatar-small-placeholder">{share.firstname?.charAt(0)}</div>
                      )}
                      <div>
                        <b>{share.firstname} {share.lastname}</b>
                        <p>Shared: "{share.roadmap_name}"</p>
                      </div>
                    </div>
                    <button onClick={() => acceptShare(share.share_id)} className="btn-success">Accept</button>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowInvitesModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Share "{currentRoadmap?.name}"</h2>
            <input type="email" placeholder="Enter friend's email" value={shareEmail} onChange={e => setShareEmail(e.target.value)} />
            <button onClick={handleShareRoadmap} className="btn-primary">Send Invite</button>
            <button onClick={() => setShowShareModal(false)} className="close-btn">Cancel</button>
          </div>
        </div>
      )}

      {message && (
        <div className="messages-banner">
          <h3>🔥 Congratulations! You’ve completed your roadmap!</h3>
          <button onClick={() => setMessage(false)}>X</button>
        </div>
      )}

      <div className="dashboard-grid">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <button type="button" className="new-roadmap-primary" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNewRoadmap(true);
              setViewRoadmap(false);
            }}>
              + Create Roadmap
            </button>
          </div>
          <h3 className="sidebar-title">My Roadmaps</h3>
          <div className="roadmaps-list">
            {roadmaps.map((rm) => (
              <div key={rm.id} className={`roadmap-list-item ${rm.id === currentRoadmapId ? 'active' : ''}`} onClick={() => viewThisRoadmap(rm.id)}>
                <div className="roadmap-title-row">
                  <span>{rm.name}</span>
                  {rm.completed && <img src="/completed.png" className="completed-icon" alt="done" />}
                </div>
                <div className="roadmap-bar-bg"><div className="roadmap-bar-fill" style={{ width: `${rm.percentage}%` }}></div></div>
                <button className="delete-roadmap-btn" onClick={(e) => deleteRoadmap(e, rm.id)}>
                  <img src="/delete.png" alt="delete" />
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          {viewRoadmap && currentRoadmap && (
            <div className="roadmap-viewer">



              <div className="tasks-container">
                <div className="controler">
                <header className="roadmap-header">


                  <div className="metrics-row">
                    <div className="metric-box bg-purple">
                      <span>Progress</span>
                      <h2>{currentRoadmap.percentage}%</h2>
                    </div>
                    <div className="metric-box bg-green">
                      <span>Completed</span>
                      <h2>{currentRoadmap.completedCont} Tasks</h2>
                    </div>
                    <div className="metric-box bg-blue">
                      <span>Pending</span>
                      <h2>{currentRoadmap.onProgress} Tasks</h2>
                    </div>
                  </div>
                </header>
                <div className="title-group">
                  <h1>{currentRoadmap.name}</h1>
                  <button onClick={() => setShowShareModal(true)} className="share-btn"><img src="/share.png" alt="" /> Share</button>
                </div>
                </div>
                {currentRoadmap.tasks.map((task) => (
                  <div key={task.id} className={`task-card ${task.completed ? 'completed-card' : ''}`}>
                    <div className="task-header">
                      <div className="task-title" onClick={() => viewSubTasks(task.id)}>
                        <span className={`collapse-icon ${multiple.includes(task.id) ? 'open' : ''}`}>▶</span>
                        <h3>{task.name}</h3>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => taskCompleted(task.id)} className={`check-btn ${task.completed ? 'checked' : ''}`}>
                          {task.completed ? '✔ Done' : 'Complete'}
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="icon-btn">🗑</button>
                      </div>
                    </div>

                    {multiple.includes(task.id) && (
                      <div className="subtasks-container">
                        {task.subtasks.map((sub) => (
                          <div key={sub.id} className="subtask-row">
                            <label className="checkbox-label">
                              <input type="checkbox" checked={sub.completed} onChange={() => subtaskCompleted(task.id, sub.id)} />
                              <span className={sub.completed ? "crossed" : ""}>{sub.name}</span>
                            </label>
                            <button onClick={() => deleteSubTask(task.id, sub.id)} className="icon-btn-small">🗑</button>
                          </div>
                        ))}
                        <div className="add-subtask-row">
                          <input type="text" value={subTaskInput} onChange={(e) => setSubTaskInput(e.target.value)} placeholder="New sub-task..." onKeyDown={(e) => e.key === "Enter" && addSubTask(task.id)} />
                          <button onClick={() => addSubTask(task.id)} className="add-plus-btn">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="add-task-card">
                  <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Enter a new primary task..." />
                  <button onClick={addTask} className="btn-primary">Add Task</button>
                </div>

                {!currentRoadmap.completed && currentRoadmap.percentage === 100 && (
                  <button onClick={() => RoadmapDone(currentRoadmap.id)} className="roadmap-completed-btn">🎉 Mark Roadmap as Done!</button>
                )}
              </div>
            </div>
          )}

          {newRoadmap && (
            <div className="new-roadmap-view">
              <div className="setup-box">
                <h1>Launch a New Journey</h1>
                <p>Turn ambitions into actionable steps. Give your roadmap a title to begin.</p>
                <div className="input-group">
                  <input type="text" placeholder="e.g. Learn System Design..." value={roadmapName} onChange={(e) => setRoadmapName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addroadmap()} />
                  <button onClick={addroadmap} className="btn-primary">Create Roadmap</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Taskspage;
