import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const generateId = () => {
    const animals = ["lion", "tiger", "zebra", "fox", "panda", "eagle", "otter", "whale"];
    const colors = ["red", "blue", "green", "yellow", "violet", "teal", "orange", "pink"];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    return `${rand(colors)}-${rand(animals)}-${Math.floor(100 + Math.random() * 900)}`;
  };

  const createNewRoom = () => {
    const newId = generateId();
    navigate(`/room/${newId}`);
  };``

  const joinRoom = () => {
    const id = roomId.trim();
    if (!id) return;
    navigate(`/room/${id}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
        {/* Top heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome to <span className="text-primary">DevPair</span>
          </h1>
          <p className="mt-2 text-base text-base-content/70">
            Real-time collaborative coding with chat and one-click execution.
          </p>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: How to use */}
          {/* LEFT: Tips */}
<section className="card bg-base-100 shadow-xl border border-base-300">
  <div className="card-body">
    <h2 className="card-title">Tips</h2>
    <ul className="space-y-4 mt-2 list-disc list-inside">
     
      <li>
        Invite collaborators by sharing the room id for instant access.
      </li>
      <li>
        Coordinate with both code and chat for maximum productivity.
      </li>
      <li>
        Run your code often to catch errors early.
      </li>
      <li>
        Your progress is saved automatically when you leave the room.
      </li>
    </ul>

    <div className="mt-6 p-4 rounded-box bg-base-200">
      <p className="text-sm">
        Pro tip: Use the same room for recurring sessions with your team.
      </p>
    </div>
  </div>
</section>


          {/* RIGHT: Create / Join card */}
          <section className="flex items-center">
            <div className="w-full">
              <div className="card bg-base-100 shadow-xl border border-base-300 max-w-lg mx-auto">
                <div className="card-body">
                  <h3 className="card-title justify-center">Start collaborating</h3>

                  {/* Create Room */}
                  <button
                    onClick={createNewRoom}
                    className="btn btn-primary w-full mt-4"
                    title="Create a new room with a friendly ID"
                  >
                    ✨ Create New Room
                  </button>

                  <div className="divider my-4">OR</div>

                  {/* Join Room */}
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Enter existing Room ID</span>
                    </div>
                    <input
                      className="input input-bordered w-full"
                      // placeholder="e.g. blue-fox-389"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      autoCapitalize="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </label>

                  <button onClick={joinRoom} className="btn btn-success w-full mt-3">
                    🔑 Join Room
                  </button>

                  {/* Small helper */}
                  <p className="mt-3 text-xs opacity-70 text-center">
                    Rooms are ephemeral until someone starts editing or chatting—then they’re saved.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
