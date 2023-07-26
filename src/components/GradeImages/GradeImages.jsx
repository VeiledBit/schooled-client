import React from "react";
import PropTypes from "prop-types";
import gradeF from "../../media/gradeF.png";
import styles from "./GradeImages.module.css";

export default function GradeImages(props) {
  const { grade1, grade2, grade3 } = props;
  return (
    <div className={styles.gradesContainerNew}>
      <img
        className={`${styles.canvasGrade} ${styles.canvasGrade1}`}
        alt="grade F"
        src={gradeF}
        style={{ display: grade1 }}
      />
      <img
        className={`${styles.canvasGrade} ${styles.canvasGrade2}`}
        alt="grade F"
        src={gradeF}
        style={{ display: grade2 }}
      />
      <img
        className={`${styles.canvasGrade}`}
        alt="grade F"
        src={gradeF}
        style={{ display: grade3 }}
      />
    </div>
  );
}

GradeImages.propTypes = {
  grade1: PropTypes.string.isRequired,
  grade2: PropTypes.string.isRequired,
  grade3: PropTypes.string.isRequired,
};
