/* eslint-disable react/prop-types */
import React from "react";
import gradeF from "../../assets/images/gradeF.png";
import styles from "./GradeImages.module.css";

export default function GradeImages({ failCount }) {
  const fails = Array.from({ length: failCount }, (_, index) => (
    <img key={index} className={`${styles.canvasGrade}`} alt="grade F" src={gradeF} />
  ));
  return <div className={styles.gradesContainerNew}>{fails}</div>;
}
