import { useEffect, useState } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Clock,
  CalendarDays,
  Repeat,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

function Reminder() {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    medicine_name: "",
    rx_cui: "",
    dosage: "",
    frequency: "Once daily",
    time: "",
    start_date: "",
    end_date: "",
    notes: "",
  });

  // ==================================================
  // FETCH REMINDERS
  // ==================================================

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/reminders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to fetch reminders"
        );
      }

      setReminders(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Error fetching reminders:", error);
      setReminders([]);
    }
  };


  // ==================================================
  // LOAD REMINDERS
  // ==================================================

  useEffect(() => {
    fetchReminders();
  }, []);


  // ==================================================
  // FORM INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  // ==================================================
  // CREATE REMINDER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create reminder"
        );
      }

      setForm({
        medicine_name: "",
        rx_cui: "",
        dosage: "",
        frequency: "Once daily",
        time: "",
        start_date: "",
        end_date: "",
        notes: "",
      });

      setShowForm(false);

      fetchReminders();

    } catch (error) {
      console.error("Create reminder error:", error);
      alert("Failed to create reminder");
    }
  };


  // ==================================================
  // DELETE REMINDER
  // ==================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this reminder?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/reminders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to delete reminder"
        );
      }

      fetchReminders();

    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete reminder");
    }
  };


  // ==================================================
  // STYLES
  // ==================================================

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    marginTop: "7px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  };


  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >

            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#f3e8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bell size={24} color="#7c3aed" />
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                fontWeight: "700",
                color: "#172033",
              }}
            >
              Medicine Reminders
            </h1>

          </div>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Stay on track with your medication schedule.
          </p>

        </div>


        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#7c3aed",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow:
              "0 4px 12px rgba(124, 58, 237, 0.2)",
          }}
        >
          <Plus size={18} />
          Add Reminder
        </button>

      </div>


      {/* SUMMARY */}

      <div
        style={{
          background:
            "linear-gradient(135deg, #f5f3ff, #eef2ff)",
          borderRadius: "18px",
          padding: "22px 25px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          border: "1px solid #e9e4ff",
        }}
      >

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={25} color="#7c3aed" />
        </div>

        <div>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            Active reminders
          </p>

          <h2
            style={{
              margin: "3px 0 0",
              fontSize: "26px",
              color: "#172033",
            }}
          >
            {reminders.length}
          </h2>

        </div>

      </div>


      {/* ADD REMINDER FORM */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "28px",
            borderRadius: "20px",
            marginBottom: "30px",
            border: "1px solid #e5e7eb",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >

          <div style={{ marginBottom: "24px" }}>

            <h2
              style={{
                margin: 0,
                fontSize: "21px",
                color: "#172033",
              }}
            >
              Add Medicine Reminder
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Set a schedule so MediGuide can remind you
              when it is time.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >

            <div>
              <label style={labelStyle}>
                Medicine Name
              </label>

              <input
                name="medicine_name"
                placeholder="e.g. Paracetamol"
                value={form.medicine_name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                RxCUI
              </label>

              <input
                name="rx_cui"
                placeholder="Optional"
                value={form.rx_cui}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                Dosage
              </label>

              <input
                name="dosage"
                placeholder="e.g. 500 mg"
                value={form.dosage}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                Frequency
              </label>

              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                style={inputStyle}
              >
                <option>Once daily</option>
                <option>Twice daily</option>
                <option>Three times daily</option>
                <option>As needed</option>
              </select>
            </div>


            <div>
              <label style={labelStyle}>
                Reminder Time
              </label>

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>


            <div>
              <label style={labelStyle}>
                Notes
              </label>

              <input
                name="notes"
                placeholder="Optional notes"
                value={form.notes}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "25px",
            }}
          >

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "11px 18px",
                border: "1px solid #d1d5db",
                background: "white",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>


            <button
              type="submit"
              style={{
                padding: "11px 20px",
                border: "none",
                background: "#3467F0",
                color: "white",
                borderRadius: "9px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Reminder
            </button>

          </div>

        </form>
      )}


      {/* REMINDERS */}

      {reminders.length === 0 ? (

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "65px 20px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >

          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "20px",
              background: "#f3e8ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <Bell size={32} color="#7c3aed" />
          </div>

          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              color: "#172033",
            }}
          >
            No reminders yet
          </h3>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
            }}
          >
            Add your first medicine reminder to stay on
            schedule.
          </p>

        </div>

      ) : (

        <div>

          <h2
            style={{
              fontSize: "19px",
              marginBottom: "15px",
              color: "#172033",
            }}
          >
            Your Reminders
          </h2>


          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >

            {reminders.map((reminder) => (

              <div
                key={reminder._id}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "20px 22px",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.04)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "17px",
                  }}
                >

                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "15px",
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Bell size={24} color="#3467F0" />
                  </div>


                  <div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          color: "#172033",
                        }}
                      >
                        {reminder.medicine_name}
                      </h3>

                      <span
                        style={{
                          padding: "4px 9px",
                          borderRadius: "20px",
                          background: "#dcfce7",
                          color: "#15803d",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        ACTIVE
                      </span>

                    </div>


                    <div
                      style={{
                        display: "flex",
                        gap: "18px",
                        marginTop: "10px",
                        flexWrap: "wrap",
                      }}
                    >

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        <Bell size={14} />
                        {reminder.dosage}
                      </span>


                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        <Repeat size={14} />
                        {reminder.frequency}
                      </span>


                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#6b7280",
                          fontSize: "13px",
                        }}
                      >
                        <Clock size={14} />
                        {reminder.time}
                      </span>

                    </div>


                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "8px",
                        color: "#9ca3af",
                        fontSize: "12px",
                      }}
                    >

                      <CalendarDays size={13} />

                      {reminder.start_date}

                      {reminder.end_date &&
                        ` → ${reminder.end_date}`}

                    </div>


                    {reminder.notes && (
                      <p
                        style={{
                          margin: "7px 0 0",
                          color: "#6b7280",
                          fontSize: "12px",
                        }}
                      >
                        {reminder.notes}
                      </p>
                    )}

                  </div>

                </div>


                <button
                  onClick={() =>
                    handleDelete(reminder._id)
                  }
                  title="Delete reminder"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "none",
                    background: "#fff1f2",
                    color: "#e11d48",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Reminder;