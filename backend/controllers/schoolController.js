import db from "../config/db.js";
import { calculateDistance } from "../utils/distance.js";



export const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
};



export const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "User latitude and longitude are required",
    });
  }

  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    const sortedSchools = results
      .map((school) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          school.latitude,
          school.longitude
        );

        return {
          ...school,
          distance: distance.toFixed(2) + " km",
        };
      })
      .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.status(200).json({
      success: true,
      schools: sortedSchools,
    });
  });
};