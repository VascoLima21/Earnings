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
    irs: {
      tier1: {
        tax: 0.125,
        isMyTier: false
      },
      tier2: {
        tax: 0.16,
        isMyTier: false
      },
      tier3: {
        tax: 0.215,
        isMyTier: false
      },
      tier4: {
        tax: 0.244,
        isMyTier: false
      },
      tier5: {
        tax: 0.314,
        isMyTier: false
      },
      tier6: {
        tax: 0.349,
        isMyTier: false
      },
      tier7: {
        tax: 0.431,
        isMyTier: false
      },
      tier8: {
        tax: 0.446,
        isMyTier: false
      },
      tier9: {
        tax: 0.48,
        isMyTier: false
      }
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

    if (!form.gender) newErrors.gender = "Please select a gender";
    if (!form.country) newErrors.country = "Please select a country";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function attributeTier() {
    let selectedTier = ""

    if (form.wage <= 8059) selectedTier = "tier1";
    if (form.wage <= 12160 && form.wage > 8059) selectedTier = "tier2";
    if (form.wage <= 17233 && form.wage > 12160) selectedTier = "tier3";
    if (form.wage <= 22306 && form.wage > 17233) selectedTier = "tier4";
    if (form.wage <= 28400 && form.wage > 22306) selectedTier = "tier5";
    if (form.wage <= 41629 && form.wage > 28400) selectedTier = "tier6";
    if (form.wage <= 44987 && form.wage > 41629) selectedTier = "tier7";
    if (form.wage <= 83696 && form.wage > 44987) selectedTier = "tier8";
    if (form.wage > 83696) selectedTier = "tier9";

    const newIrs = { ...form.irs }
    for (let tier in newIrs) {
      if (tier == selectedTier) {
        newIrs[selectedTier].isMyTier = true
        return newIrs[selectedTier]
      }
    }
  }

  function getMyWage(irs) {
    let finalWage = form.wage - form.wage * irs.tax
    console.log(finalWage);
    console.log("Form wage", form.wage);
    console.log("Form wage * irs.tax", form.wage * irs.tax);



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

    doc.text(myWage, 10, 10);
    doc.text("Meow", 10, 30);
    doc.save("a4.pdf");
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
      irs: {
        tier1: {
          tax: 0.125,
          isMyTier: false
        },
        tier2: {
          tax: 0.16,
          isMyTier: false
        },
        tier3: {
          tax: 0.215,
          isMyTier: false
        },
        tier4: {
          tax: 0.244,
          isMyTier: false
        },
        tier5: {
          tax: 0.314,
          isMyTier: false
        },
        tier6: {
          tax: 0.349,
          isMyTier: false
        },
        tier7: {
          tax: 0.431,
          isMyTier: false
        },
        tier8: {
          tax: 0.446,
          isMyTier: false
        },
        tier9: {
          tax: 0.48,
          isMyTier: false
        }
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