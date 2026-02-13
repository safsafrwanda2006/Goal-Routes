import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Taskspage.css";
import './smallScreensTasks.css'

function Taskspage() {
  const aboutref = useRef(null);
  const [newRoadmap, setNewRoadmap] = useState(true);
  const [viewRoadmap, setViewRoadmap] = useState(true);
  const [roadmaps, setRoadmaps] = useState([]);
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);
  const [roadmapName, setRoadmapName] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [subTaskInput, setSubTaskInput] = useState("");
  const [viewProgressPars, setviewProgressPars] = useState(false);
  const [sidPar, setSidPar] = useState(false);
  const [multiple, setMultiple] = useState([]);
  const [message, setMessage] = useState(false);

  useEffect(() => {
    const savedRoadmaps = localStorage.getItem("roadmaps");
    if (savedRoadmaps) {
      setRoadmaps(JSON.parse(savedRoadmaps));
    }
  }, []);

  useEffect(() => {
    if (roadmaps.length > 0) {
      localStorage.setItem("roadmaps", JSON.stringify(roadmaps));
    }
  }, [roadmaps]);

  const currentRoadmap = roadmaps.find((rm) => rm.id === currentRoadmapId);


  //   sample of data
  //   const currentRoadmap2 = {
  //   id: "temp-1",
  //   name: "Become a Frontend Developer",
  //   tasksCont: 3,
  //   completedCont: 1,
  //   onProgress: 2,
  //   percentage: 33,
  //   completed: false,
  //   tasks: [
  //     {
  //       id: "task-1",
  //       name: "Learn HTML & CSS",
  //       completed: true,
  //       total: 2,
  //       subCompletedCount: 1,
  //       subtasks: [
  //         { id: "sub-1", name: "HTML Basics", completed: true },
  //         { id: "sub-2", name: "CSS Flexbox", completed: false },
  //       ],
  //     },
  //     {
  //       id: "task-2",
  //       name: "Learn JavaScript",
  //       completed: false,
  //       total: 3,
  //       subCompletedCount: 1,
  //       subtasks: [
  //         { id: "sub-3", name: "Variables & Types", completed: true },
  //         { id: "sub-4", name: "Functions", completed: false },
  //         { id: "sub-5", name: "DOM Manipulation", completed: false },
  //       ],
  //     },
  //     {
  //       id: "task-3",
  //       name: "Learn React",
  //       completed: false,
  //       total: 2,
  //       subCompletedCount: 0,
  //       subtasks: [
  //         { id: "sub-6", name: "Components & Props", completed: false },
  //         { id: "sub-7", name: "useState & useEffect", completed: false },
  //       ],
  //     },
  //   ],
  // };





  function viewabout() {
    const target = aboutref.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function viewSubTasks(taskId) {
    let cpyMultiple = [...multiple];
    const findIndexOfCurrent = cpyMultiple.indexOf(taskId);

    if (findIndexOfCurrent === -1) {
      cpyMultiple.push(taskId);
    } else {
      cpyMultiple.splice(findIndexOfCurrent, 1);
    }
    setMultiple(cpyMultiple);
  }

  function RoadmapDone(id) {
    setRoadmaps(prev =>
      prev.map(rm =>
        rm.id === id
          ? { ...rm, completed: true }
          : rm
      )
    );
    setMessage(true);
  }


  function taskCompleted(taskId) {
    setRoadmaps((prev) =>
      prev.map((rm) =>
        rm.id !== currentRoadmapId
          ? rm
          : {
            ...rm,
            completedCont: rm.tasks.find(t => t.id === taskId)?.completed
              ? (rm.completedCont || 0) - 1
              : (rm.completedCont || 0) + 1,
            onProgress: rm.tasks.find(t => t.id === taskId)?.completed
              ? (rm.tasksCont || 0) - (rm.completedCont || 0) + 1
              : (rm.tasksCont || 0) - (rm.completedCont || 0) - 1,

            // percentage: rm.tasks.find(t => t.id === taskId)?.completed
            //   ? Math.round(((rm.completedCont - 1) / rm.tasksCont) * 100)
            //   : Math.round(((rm.completedCont + 1) / rm.tasksCont) * 100),

            tasks: rm.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task,
            ),
          },
      ),
    );
  }
  function subtaskCompleted(taskId, subTaskId) {
    setRoadmaps((prev) =>
      prev.map((rm) => {
        if (rm.id !== currentRoadmapId) return rm;

        let totalSubtasks = 0;
        let completedSubtasks = 0;

        rm.tasks.forEach((t) => {
          totalSubtasks += t.total || 0;
          completedSubtasks += t.subCompletedCount || 0;
        });

        const isCompleted =
          rm.tasks
            .find(t => t.id === taskId)
            ?.subtasks.find(s => s.id === subTaskId)
            ?.completed;

        const newCompletedSubtasks = isCompleted
          ? completedSubtasks - 1
          : completedSubtasks + 1;

        return {
          ...rm,

          percentage:
            totalSubtasks === 0
              ? 0
              : Math.round((newCompletedSubtasks / totalSubtasks) * 100),

          tasks: rm.tasks.map((task) =>
            task.id === taskId
              ? {
                ...task,
                subCompletedCount: isCompleted
                  ? task.subCompletedCount - 1
                  : task.subCompletedCount + 1,
                subtasks: task.subtasks.map((sub) =>
                  sub.id === subTaskId
                    ? { ...sub, completed: !sub.completed }
                    : sub
                ),
              }
              : task
          ),
        };
      })
    );
  }


  function viewThisRoadmap(id) {
    setCurrentRoadmapId(id);
    setNewRoadmap(false);
    setViewRoadmap(true);
    setviewProgressPars(true);
  }

  function addroadmap() {
    if (roadmapName.trim() === "") {
      alert("Enter the Roadmap Name");
      return;
    }
    const newRoadmap = {
      id: crypto.randomUUID(),
      name: roadmapName,
      completed: false,
      tasksCont: 0,
      completedCont: 0,
      onProgress: 0,
      percentage: 0,
      tasks: [],
    };
    setRoadmaps((prev) => [...prev, newRoadmap]);
    setCurrentRoadmapId(newRoadmap.id);
    setRoadmapName("");
    setViewRoadmap(true);
    setNewRoadmap(false);
    setviewProgressPars(true);
  }

  function deleteRoadmap(currentRoadmapId) {
    if (!window.confirm("Are you sure you want to delete this Roadmap?")) return;
    setRoadmaps((prev) => {
      const updatedRoadmaps = prev.filter(
        (rm => rm.id !== currentRoadmapId)
      );
      localStorage.setItem(
        "roadmaps",
        JSON.stringify(updatedRoadmaps)
      )
      setNewRoadmap(true);
      return updatedRoadmaps;
    });
  }


  function addTask() {
    if (taskInput.trim() === "") return;

    setRoadmaps((prev) =>
      prev.map((rm) =>
        rm.id === currentRoadmapId
          ? {
            ...rm,
            tasksCont: rm.tasksCont ? rm.tasksCont + 1 : 1,
            onProgress: rm.onProgress ? rm.onProgress + 1 : 1,
            tasks: [
              ...rm.tasks,
              {
                id: crypto.randomUUID(),
                name: taskInput,
                completed: false,
                total: 0,
                subCompletedCount: 0,
                subtasks: [],
              },
            ],
          }
          : rm,
      ),
    );
    setTaskInput("");
  }


  function deleteTask(taskId) {
    if (!window.confirm("Are you sure you want to delete this task")) return;
    setRoadmaps((prev) =>
      prev.map((rm) =>
        rm.id !== currentRoadmapId
          ? rm
          : {
            ...rm,
            tasksCont: rm.tasksCont - 1,
            onProgress: rm.onProgress ? rm.onProgress - 1 : 1,
            tasks: rm.tasks
              .map((task) =>
                task.id === taskId
                  ? { ...task, completed: false }
                  : task
              )
              .filter((task) => task.id !== taskId),
          }
      )
    );
  }

  function addSubTask(taskId) {
    if (subTaskInput.trim() === "") return;

    setRoadmaps((prev) =>
      prev.map((rm) =>
        rm.id === currentRoadmapId
          ? {
            ...rm,

            tasks: rm.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  total: task.total ? task.total + 1 : 1,
                  subtasks: [
                    ...task.subtasks,
                    {
                      id: crypto.randomUUID(),
                      name: subTaskInput,
                      completed: false,
                    },
                  ],
                }
                : task,
            ),
          }
          : rm,
      ),
    );
    setSubTaskInput("");
  }

  function deleteSubTask(taskId, subTaskId) {
    setRoadmaps((prev) =>
      prev.map((rm) =>
        rm.id === currentRoadmapId
          ? {
            ...rm,

            tasks: rm.tasks.map((task) =>
              task.id === taskId
                ? {
                  ...task,
                  total: task.total - 1,
                  subtasks: task.subtasks
                    .map((sub) =>
                      sub.id === subTaskId
                        ? { ...sub, completed: false }
                        : sub,
                    )
                    .filter((sub) => sub.id !== subTaskId)
                }
                : task,
            ),
          }
          : rm,
      ),
    );
  }

  function goToNewRoadmap() {
    setNewRoadmap(true);
  }

  return (
    <>
      <div
        className="taskpcontainer"
        onClick={() => {
          setSidPar(false);
          setMessage(false);
        }}
      >
        <header className="header">
          <div>
            <Link className="logo" to="/">
              <h1>G</h1>
              <img src="rising.png" alt="" />
              <h1>R</h1>
            </Link>
          </div>
          <div className="menubtns">
            <button
              onClick={goToNewRoadmap}
            ><h4>start</h4> <img src="shuttle.png" alt="" /></button>
            {/* <button><h4>languages</h4> <img src="world.png" alt="" /></button> */}
            <button
              onClick={viewabout}
            ><h4>about</h4> <img src="info.png" alt="" /></button>
          </div>
        </header>

        <div className="tasks-container">
          {message && (
            <div className="messages">
              <div className="message">
                <h3>🔥 Congratulations! You’ve completed your roadmap! Keep the momentum going!</h3>
                <button
                  onClick={() => { setMessage(false) }}
                ><img src="delete (2).png" alt="" /></button>
              </div>
            </div>
          )}
          <div className="sid-par">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidPar((prev) => !prev);
              }}
              className="sidpar-btn"
            >
              <img src="menu.png" alt="" />
            </button>
            {sidPar && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="par"
              >
                <div className="logo-par">
                  <h1>G</h1>
                  <img src="rising.png" alt="" />
                  <h1>R</h1>
                </div>
                <button className="new-roadmap-btn" onClick={goToNewRoadmap}>
                  New Roadmap
                  <img src="livewhite.png" alt="" />
                </button>
                <h3 className="my-roadmaps">My Roadmaps</h3>
                <div className="content-btns">
                  {roadmaps.map((rm) => (
                    <div key={rm.id} className={
                      rm.id === currentRoadmapId
                        ? "roadmaps-btns-clicked"
                        : "roadmaps-btns"}>
                      <div>
                        <button className="roadmap-name"
                          onClick={() => viewThisRoadmap(rm.id)}>
                          <div className="roadmap-names">{rm.name}</div>

                          <img
                            className={rm.completed
                              ? "completed-true"
                              : "completed-false"}
                            src="completed.png" alt="" />
                          <button
                            className="delete-btn roadmap-del"
                            onClick={() => deleteRoadmap(rm.id)}
                          ><img src="delete.png" alt="" /></button>
                        </button>
                      </div>
                    </div>
                  ))}


                </div>


              </div>
            )}
          </div>
          {viewRoadmap && !newRoadmap && (
            <>

              {currentRoadmap && (
                <>
                  <>

                    {currentRoadmap.tasks.length >= 0 && (
                      <div className="progresspar progress">
                        <div className="progress-info">
                          <h3>Progress</h3>
                          <div className="progress-percentage percentage-sign">
                            <h1>
                              {currentRoadmap.tasks.length === 0
                                ? "0"
                                : `${currentRoadmap.percentage}`}
                            </h1><h3>%</h3>
                          </div>
                        </div>
                        <img src="dashboard.png" alt="" />
                      </div>
                    )}


                    <div className="progresspar completed">
                      <div className="progress-info">
                        <h3>Completed Tasks</h3>
                        <div className="progress-percentage">
                          <h1>{currentRoadmap.completedCont}</h1><h3>Task</h3>
                        </div>
                      </div>
                      <img src="done.png" alt="" />
                    </div>

                    <div className="progresspar on-progress">
                      <div className="progress-info">
                        <h3>On Progress</h3>
                        <div className="progress-percentage">
                          <h1>{currentRoadmap.onProgress}</h1><h3>Task</h3>
                        </div>
                      </div>
                      <img src="hourglass.png" alt="" />
                    </div>



                    <div className="tasks-manager ">
                      <div className="name">
                        <h1>{currentRoadmap.name}</h1>
                      </div>

                      {currentRoadmap.tasks.map((task) => (
                        <div key={task.id}>
                          <div
                            className={task.completed ? "completed-task" : "task"}
                          >
                            <button
                              onClick={() => viewSubTasks(task.id)}
                              className="arrow-btn"
                            >
                              <img
                                src={
                                  multiple.indexOf(task.id) !== -1
                                    ? "down.png"
                                    : "right-arrow.png"
                                }
                                alt=""
                              />
                            </button>
                            <h3>{task.name}</h3>
                            <button
                              onClick={() => taskCompleted(task.id)}
                              className="task-check-btn"
                            >Done<div
                              className={
                                task.completed ? "img-btn-completed" : "img-btn"
                              }
                            >
                                <img src="check.png" alt="" />
                              </div>
                            </button>
                            <button
                              className="delete-btn task-del"
                              onClick={() => deleteTask(task.id)}
                            ><img src="delete.png" alt="" /></button>
                          </div>

                          {multiple.indexOf(task.id) !== -1 && (
                            <div className="sub-tasks">
                              <ul>
                                {task.subtasks.map((sub) => (
                                  <li key={sub.id}>
                                    <div className="sub-task-name">{sub.name}</div>
                                    <input
                                      checked={sub.completed}
                                      onChange={() => subtaskCompleted(task.id, sub.id)}
                                      type="checkbox"
                                    />
                                    <button
                                      className="delete-btn subtask-del"
                                      onClick={() => deleteSubTask(task.id, sub.id)}
                                    ><img src="delete.png" alt="" /></button>
                                  </li>
                                ))}

                                <li className="new-sub-task">
                                  <input
                                    value={subTaskInput}
                                    onChange={(e) =>
                                      setSubTaskInput(e.target.value)
                                    }
                                    type="text"
                                    placeholder="Enter sub Task"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        addSubTask(task.id);
                                      }
                                    }}
                                  />
                                  <button onClick={() => addSubTask(task.id)}>
                                    +
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="task add-task">
                        <input
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTask();
                          }}
                          type="text"
                          placeholder="Enter Task..."
                        />
                        <button onClick={addTask}>Add Task</button>
                      </div>
                      {currentRoadmap && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            RoadmapDone(currentRoadmap.id)
                          }}
                          className="final-btn"
                        >Roadmap Completed</button>
                      )}
                    </div>
                  </>
                </>
              )}
            </>
          )}

          {newRoadmap && (
            <div className="tasks-manager">
              <div className="name">
                <div className="new-roadmap">
                  <h1>New Roadmap</h1>
                </div>
                <div className="name-Input">
                  <input
                    type="text"
                    placeholder="Enter Your Roadmap Title.."
                    value={roadmapName}
                    onChange={(e) => setRoadmapName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addroadmap();
                      }
                    }}
                  />
                </div>
              </div>
              <div className="task">
                <h3>Turn your ambition into a clear, achievable roadmap — start now</h3>
              </div>
              <button
                className="final-btn"
                onClick={() => {
                  addroadmap();
                }}
              >
                Create Your Roadmap
              </button>
            </div>
          )}
        </div>


        <footer className="footer">
          <h2
            ref={aboutref}
          >GoalRoutes</h2>
          <p>
            Transform your ambitions into reality. Track your growth, celebrate your achievements,
            and stay motivated every step of the way.
          </p>

          <div className="social-icons">
            <a href="mailto:safsafrwanda2006@gmail.com"><img src="email.png" alt="Email" /></a>
            <a href="http://wa.me/250794101251" target="_blank"><img src="whatsapp.png" alt="WhatsApp" /></a>
            <a href="https://github.com/safsafrwanda2006"><img src="facebook.png" alt="GitHub" /></a>
            <a href="https://www.linkedin.com/in/mustafa-hassan-b26ab5370/"><img src="instgram.png" alt="LinkedIn" /></a>
          </div>

          <p className="footer-note">
            © 2025 GoalRoutes. All rights reserved. | Developed by.
            <a className='Mustafa' href="https://safsafrwanda2006.github.io/Protfolio/" target="_blank"> <u>Mustafa Khamis</u></a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default Taskspage;
