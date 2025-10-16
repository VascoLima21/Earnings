import { useState } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [form, setForm] = useState({
    firstName: "",
    wage: 0,
    lastName: "",
    email: "",
    password: "",
    gender: "",
    hobbies: [],
    country: "",
    bio: "",
    holders: "",
    dependants: "",
    irs: {
      tier1: 0.125,
      tier2: 0.16,
      tier3: 0.215,
      tier4: 0.244,
      tier5: 0.314,
      tier6: 0.349,
      tier7: 0.431,
      tier8: 0.446,
      tier9: 0.48,
    }
  });

  const [errors, setErrors] = useState({});

  // Handle all input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Multiple checkboxes (hobbies)
      if (checked) {
        setForm({ ...form, hobbies: [...form.hobbies, value] });
      } else {
        setForm({
          ...form,
          hobbies: form.hobbies.filter((h) => h !== value),
        });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  // Form validation
  function validate() {
    const newErrors = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Email is invalid";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.wage) newErrors.wage = "Please select a wage";
    if (!form.holders) newErrors.holders = "Please select a holders ammount";

    if (!form.gender) newErrors.gender = "Please select a gender";
    if (!form.country) newErrors.country = "Please select a country";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function attributeTier() {
    let selectedTier = ""
    let newWage = form.wage

    if (form.holders == "2") {
      newWage /= 2
    }

    if (newWage <= 8059) selectedTier = "tier1";
    if (newWage <= 12160 && newWage > 8059) selectedTier = "tier2";
    if (newWage <= 17233 && newWage > 12160) selectedTier = "tier3";
    if (newWage <= 22306 && newWage > 17233) selectedTier = "tier4";
    if (newWage <= 28400 && newWage > 22306) selectedTier = "tier5";
    if (newWage <= 41629 && newWage > 28400) selectedTier = "tier6";
    if (newWage <= 44987 && newWage > 41629) selectedTier = "tier7";
    if (newWage <= 83696 && newWage > 44987) selectedTier = "tier8";
    if (newWage > 83696) selectedTier = "tier9";

    for (let tier in form.irs) {
      if (tier == selectedTier) {
        return form.irs[selectedTier]
      }
    }
  }

  function getMyWage(tax) {
    console.log(tax);

    let finalWage = form.wage - form.wage * tax
    if (form.dependants == "1") {
      finalWage += 600
    } else if (form.dependants == "2") {
      finalWage += 1200
    }
    return finalWage
  }

  // Submit
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    alert("Form submitted:\n" + JSON.stringify(form, null, 2));
    let irs = attributeTier()
    let myWage = String(getMyWage(irs))
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("IRS Wage Report", 105, 15, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 20, 200, 20);

    // Personal Information
    doc.setFontSize(14);
    doc.text("Personal Information", 10, 30);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${form.firstName} ${form.lastName}`, 10, 40);
    doc.text(`Email: ${form.email}`, 10, 47);
    doc.text(`Gender: ${form.gender}`, 10, 54);
    doc.text(`Country: ${form.country}`, 10, 61);
    doc.text(`Hobbies: ${form.hobbies.join(", ") || "None"}`, 10, 68);

    // IRS Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("IRS Information", 10, 80);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Gross Wage: €${Number(form.wage).toFixed(2)}`, 10, 90);
    doc.text(`IRS Tier: ${(irs * 100).toFixed(1)}%`, 10, 97);
    doc.text(`Holders: ${form.holders || "N/A"}`, 10, 104);
    doc.text(`Dependants: ${form.dependants || "0"}`, 10, 111);

    // Final Result
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Final Result", 10, 125);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Net Wage (after IRS & dependants): €${myWage}`, 10, 135);

    doc.save("MyNetWage.pdf");
  }


  // Reset
  function resetForm() {
    setForm({
      firstName: "",
      wage: 0,
      lastName: "",
      email: "",
      password: "",
      gender: "",
      hobbies: [],
      country: "",
      bio: "",
      holders: "",
      dependants: "",
      irs: {
        tier1: 0.125,
        tier2: 0.16,
        tier3: 0.215,
        tier4: 0.244,
        tier5: 0.314,
        tier6: 0.349,
        tier7: 0.431,
        tier8: 0.446,
        tier9: 0.48,
      }
    });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h1>Complex Registration Form</h1>

      {/* First Name */}
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
      />
      {errors.firstName && <p style={{ color: "red" }}>{errors.firstName}</p>}
      <br /><br />

      {/* Last Name */}
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
      />
      <br /><br />

      {/* Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      <br /><br />

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      <br /><br />

      {/* Gender (Radio) */}
      <p>Gender:</p>
      <label>
        <input
          type="radio"
          name="gender"
          value="Male"
          checked={form.gender === "Male"}
          onChange={handleChange}
        />
        Male
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="Female"
          checked={form.gender === "Female"}
          onChange={handleChange}
        />
        Female
      </label>
      {errors.gender && <p style={{ color: "red" }}>{errors.gender}</p>}
      <br /><br />

      {/* Wage */}
      <p>Wage:</p>
      <input
        type="number"
        name="wage"
        placeholder="Wage"
        value={form.wage}
        onChange={handleChange}
      />
      {errors.wage && <p style={{ color: "red" }}>{errors.wage}</p>}
      <br /><br />

      {/* Holder */}
      <p>Holders:</p>
      <label>
        <input
          type="radio"
          name="holders"
          value="1"
          checked={form.holders === "1"}
          onChange={handleChange}
        />
        1
      </label>
      <label>
        <input
          type="radio"
          name="holders"
          value="2"
          checked={form.holders === "2"}
          onChange={handleChange}
        />
        2
      </label>
      {errors.holder && <p style={{ color: "red" }}>{errors.holder}</p>}
      <br /><br />

      {/* Dependants */}
      <p>Dependants:</p>
      <label>
        <input
          type="radio"
          name="dependants"
          value="1"
          checked={form.dependants === "1"}
          onChange={handleChange}
        />
        1
      </label>
      <label>
        <input
          type="radio"
          name="dependants"
          value="2"
          checked={form.dependants === "2"}
          onChange={handleChange}
        />
        2
      </label>
      <br /><br />

      {/* Hobbies (Checkboxes) */}
      <p>Hobbies:</p>
      <label>
        <input
          type="checkbox"
          value="Sports"
          checked={form.hobbies.includes("Sports")}
          onChange={handleChange}
        />
        Sports
      </label>
      <label>
        <input
          type="checkbox"
          value="Music"
          checked={form.hobbies.includes("Music")}
          onChange={handleChange}
        />
        Music
      </label>
      <label>
        <input
          type="checkbox"
          value="Reading"
          checked={form.hobbies.includes("Reading")}
          onChange={handleChange}
        />
        Reading
      </label>
      <br /><br />

      {/* Country (Select) */}
      <select name="country" value={form.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="Brazil">Brazil</option>
        <option value="USA">USA</option>
        <option value="Japan">Japan</option>
      </select>
      {errors.country && <p style={{ color: "red" }}>{errors.country}</p>}
      <br /><br />

      {/* Bio (Textarea) */}
      <textarea
        name="bio"
        placeholder="Tell us about yourself"
        value={form.bio}
        onChange={handleChange}
      />
      <br /><br />

      {/* Buttons */}
      <button type="submit">Submit</button>
      <button type="button" onClick={resetForm} style={{ marginLeft: "10px" }}>
        Reset
      </button>
    </form>
  );
}
export default App;