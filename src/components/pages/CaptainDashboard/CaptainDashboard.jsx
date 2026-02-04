import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/axios";
import "./CaptainDashboard.css";

const CaptainDashboard = () => {
    const [houseData, setHouseData] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
}