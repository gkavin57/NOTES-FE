import { useFormik } from "formik";
import axios from "axios";
import React, { useEffect } from "react";
import { env } from "../config";
import { useNavigate, useParams } from "react-router-dom";

function EditNote() {
  const params = useParams();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      date: "",
    },
    validate: (values) => {
      let errors = {};

      if (values.title === "") {
        errors.title = "Please enter Title";
      }
      if (values.content === "") {
        errors.content = "Please enter Content";
      }
      if (values.date === "") {
        errors.date = "Please select Date";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (window.localStorage.getItem("app-token")) {
          let Notes = await axios.put(
            `http://localhost:7000/api/notes/${params.id}`,
            values,
            {
              headers: {
                Authorization: window.localStorage.getItem("app-token"),
              },
            }
          );
        }

        alert("Note Edited");
        navigate("/portal/home");
      } catch (err) {
        window.location.href = "/";
      }
    },
  });

  useEffect(() => {
    getNote();
  }, []);

  let getNote = async () => {
    try {
      let note = await axios.get(
        `http://localhost:7000/api/notes/${params.id}`,
        {
          headers: { Authorization: window.localStorage.getItem("app-token") },
        }
      );
      formik.setValues({
        title: note.data.title,
        content: note.data.content,
        date: note.data.date,
      });
    } catch (error) {
      window.location.href = "/";
    }
  };
  return (
    <>
      <div className="container">
        <div className="d-flex align-items-center justify-content-center pt-5 mb-4">
          <h1 className="h3 mb-0 text-dark-800">Edit Note</h1>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="row ">
            <div className="col-lg-6 mx-auto">
              <div className="  pb-3">
                <label>TITLE</label>
                <input
                  className={`form-control ${
                    formik.errors.title ? `input-error` : ``
                  }`}
                  type={"text"}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  name="title"
                />
                <span style={{ color: "red" }}>{formik.errors.title}</span>
              </div>
              <div className=" pb-3">
                <label>CONTENT</label>
                <textarea
                  className="form-control"
                  type={"text"}
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  name="content"
                />
                <span style={{ color: "red" }}>{formik.errors.content}</span>
              </div>
              <div className=" pb-5">
                <label>DATE</label>
                <input
                  className="form-control"
                  type={"date"}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  name="date"
                />
              </div>
              <div className="text-center ">
                <input
                  className="btn btn-outline-primary"
                  type={"submit"}
                  value="Submit"
                  disabled={!formik.isValid}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditNote;
