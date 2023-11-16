import React, { useState } from "react";
import RecommendedRemedy from "../Models/RecommendedRemedy";

export default function RecommendRemediesViewModel() {
    const [remedy1, setRemedy1] = useState("");

    const getRemedy1 = (name) => {
        setRemedy1(name)
        return remedy1;
    }

    return {
        getRemedy1,
      };

    
}