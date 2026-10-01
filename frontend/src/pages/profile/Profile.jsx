import React, { useEffect, useState } from "react";
import DashboardLayout from "../../component/dashboard/DashboardLayout";
import api from "../../api/axios";

function Profile() {
  const stored = JSON.parse(localStorage.getItem("user") || "null");
  const role = stored?.role === "admin"
    ? "admin"
    : stored?.role === "seller"
      ? "seller"
      : "buyer";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    gender: ""
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState(false);

  const [pendingEmail, setPendingEmail] = useState("");
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: ""
  });
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          address: user.address || "",
          city: user.city || "",
          gender: user.gender || ""
        });

        setPendingEmail(user.pendingEmail || "");

      } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);
        alert(
          error.response?.data?.message ||
          "Failed to load your profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value
    });
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const response = await api.patch("/users/me", {
        name: profile.name,
        mobile: profile.mobile,
        address: profile.address,
        city: profile.city,
        gender: profile.gender
      });

      // The sidebar and dashboards read the name from localStorage, so keep
      // the stored copy in step with what the server now holds.
      const updated = response.data.user;
      const current = JSON.parse(localStorage.getItem("user") || "null");

      if (current) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...current, name: updated.name })
        );
      }

      alert("Profile updated successfully");

    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
      alert(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEmailFormChange = (event) => {
    setEmailForm({
      ...emailForm,
      [event.target.name]: event.target.value
    });
  };

  const requestEmailChange = async (event) => {
    event.preventDefault();

    try {
      setChangingEmail(true);

      const response = await api.patch("/users/me/email", {
        newEmail: emailForm.newEmail,
        currentPassword: emailForm.currentPassword
      });

      alert(response.data.message);

      setPendingEmail(response.data.pendingEmail || emailForm.newEmail);
      setEmailForm({ newEmail: "", currentPassword: "" });

    } catch (error) {
      console.error("EMAIL CHANGE ERROR:", error);
      alert(
        error.response?.data?.message ||
        "Failed to request the email change"
      );
    } finally {
      setChangingEmail(false);
    }
  };

  const cancelEmailChange = async () => {
    if (!window.confirm("Cancel the pending email change?")) {
      return;
    }

    try {
      await api.delete("/users/me/email");

      setPendingEmail("");
      alert("Email change request cancelled");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to cancel the request"
      );
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();

    if (passwords.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("The two new passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);

      await api.patch("/users/me/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      alert("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error("PASSWORD CHANGE ERROR:", error);
      alert(
        error.response?.data?.message ||
        "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={role} title="My Profile">
        <p>Loading your profile...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role} title="My Profile">
      <div className="grid gap-6 lg:grid-cols-2">

        {/* ---------- Account details ---------- */}
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black">
            Account Details
          </h2>

          <p className="mt-1 text-sm text-muted">
            Update the information shown on your account.
          </p>

          <form onSubmit={saveProfile} className="mt-6 space-y-4">

            <label className="block text-sm font-bold">
              Full Name
              <input
                required
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Email
              <input
                type="email"
                value={profile.email}
                readOnly
                disabled
                className="mt-2 w-full cursor-not-allowed rounded-xl border bg-gray-100 p-3 font-normal text-muted"
              />
              <span className="mt-1 block text-xs font-normal text-muted">
                Changed separately, below, because it needs verifying.
              </span>
            </label>

            <label className="block text-sm font-bold">
              Mobile
              <input
                required
                type="text"
                name="mobile"
                value={profile.mobile}
                onChange={handleProfileChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Address
              <input
                required
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              City
              <input
                required
                type="text"
                name="city"
                value={profile.city}
                onChange={handleProfileChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Gender
              <select
                required
                name="gender"
                value={profile.gender}
                onChange={handleProfileChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* ---------- Change password ---------- */}
        <section className="rounded-2xl bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-muted">
            You will need your current password to set a new one.
          </p>

          <form onSubmit={savePassword} className="mt-6 space-y-4">

            <label className="block text-sm font-bold">
              Current Password
              <input
                required
                type={showPasswords ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              New Password
              <input
                required
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Confirm New Password
              <input
                required
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={() => setShowPasswords(!showPasswords)}
              />
              Show passwords
            </label>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-cream p-4">
            <p className="text-xs leading-5 text-muted">
              <b className="text-ink">Account role:</b>{" "}
              {stored?.role || "unknown"}
              <br />
              Your role determines what you can access and can only be changed
              by an administrator.
            </p>
          </div>
        </section>

        {/* ---------- Email address ---------- */}
        <section className="rounded-2xl bg-white p-6 shadow-soft lg:col-span-2">
          <h2 className="text-xl font-black">
            Email Address
          </h2>

          <p className="mt-1 text-sm text-muted">
            You sign in with this address, so a change has to be confirmed from
            the new inbox before it takes effect.
          </p>

          {pendingEmail ? (
            <div className="mt-6 rounded-xl border border-gold bg-cream p-5">
              <p className="text-sm font-bold text-ink">
                Waiting for confirmation
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                A confirmation link was sent to{" "}
                <b className="text-ink">{pendingEmail}</b>. Open it to complete
                the change. Until then you keep signing in with{" "}
                <b className="text-ink">{profile.email}</b>.
              </p>

              <p className="mt-2 text-xs text-muted">
                The link expires one hour after it was requested.
              </p>

              <button
                type="button"
                onClick={cancelEmailChange}
                className="mt-4 rounded-xl border px-4 py-2 text-sm font-bold"
              >
                Cancel this request
              </button>
            </div>
          ) : (
            <form
              onSubmit={requestEmailChange}
              className="mt-6 grid gap-4 md:grid-cols-2"
            >
              <label className="block text-sm font-bold">
                New Email Address
                <input
                  required
                  type="email"
                  name="newEmail"
                  value={emailForm.newEmail}
                  onChange={handleEmailFormChange}
                  className="mt-2 w-full rounded-xl border p-3 font-normal"
                  placeholder="new@example.com"
                />
              </label>

              <label className="block text-sm font-bold">
                Current Password
                <input
                  required
                  type="password"
                  name="currentPassword"
                  value={emailForm.currentPassword}
                  onChange={handleEmailFormChange}
                  className="mt-2 w-full rounded-xl border p-3 font-normal"
                  placeholder="Confirm it is you"
                />
              </label>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={changingEmail}
                  className="w-full rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50 md:w-auto md:px-8"
                >
                  {changingEmail ? "Sending..." : "Send Confirmation Link"}
                </button>

                <p className="mt-3 text-xs leading-5 text-muted">
                  Your password is required because a session alone should not
                  be enough to move an account to a different mailbox. We also
                  notify your current address whenever a change is requested.
                </p>
              </div>
            </form>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Profile;