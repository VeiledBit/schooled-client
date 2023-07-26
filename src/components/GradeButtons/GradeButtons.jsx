import React from "react";
import PropTypes from "prop-types";
import styles from "./GradeButtons.module.css";

export default function GradeButtons(props) {
  const { value, incrementFails, decrementFails, disabled } = props;
  return (
    <>
      <button
        type="button"
        title="Increase F grade count"
        disabled={disabled}
        className={`btn ${styles.btnFPlus} div3`}
        value={value}
        onClick={incrementFails}
      >
        +F
      </button>
      <button
        type="button"
        title="Decrease F grade count"
        disabled={disabled}
        className="btn div4"
        value={value}
        onClick={decrementFails}
      >
        -F
      </button>
    </>
  );
}

GradeButtons.propTypes = {
  value: PropTypes.string.isRequired,
  incrementFails: PropTypes.func.isRequired,
  decrementFails: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GradeButtons.defaultProps = {
  disabled: null,
};
