import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/register";
import { Button, CardMedia, Typography, Paper } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import ParticlesBg from "particles-bg";
import { baseApi } from "../../../environment";

export default function Register() {
  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };

  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const fileinputRef = React.useRef(null);

  const handleClearFile = () => {
    if (fileinputRef.current) {
      fileinputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      if (!file) {
        toast.error("Please upload a school image!");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      formData.append("school_name", values.school_name);
      formData.append("owner_name", values.owner_name);
      formData.append("password", values.password);
      formData.append("email", values.email);

      try {
        const res = await axios.post(`${baseApi}/school/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("School registered successfully!");
        formik.resetForm();
        handleClearFile();
      } catch (err) {
        console.error("Error registering school:", err);
        toast.error(err.response?.data?.message || "Registration failed");
      }
    },
  });

  return (
    <>
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <ParticlesBg className="particles" color="#ff0000" type="cobweb" bg={true} />

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          margin: "auto",
          maxWidth: "550px",
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Semi-transparent white background
          backdropFilter: "blur(5px)",
        }}
      >
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "left",
          }}
          noValidate
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Typography
            variant={"h4"}
            sx={{
              textAlign: "center",
              margin: "0",
              padding: "0",
              color: "black",
              fontWeight: "800",
              fontFamily: "verdana",
            }}
          >
            Register
          </Typography>

          <Typography variant="p" color="black">
            Add School Picture
          </Typography>
          <TextField
            type="file"
            inputRef={fileinputRef}
            onChange={addImage}
            InputProps={{
              style: {
                padding: "8px",
                backgroundColor: "#FFFFFF",
                borderRadius: "4px",
                color: "#333333",
              },
            }}
          />
          {imageUrl && (
            <CardMedia
              component="img"
              height="240"
              image={imageUrl}
              sx={{ borderRadius: "8px", margin: "8px 0" }}
            />
          )}

          <TextField
            name="school_name"
            label="School Name"
            variant="outlined"
            fullWidth
            value={formik.values.school_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.school_name && Boolean(formik.errors.school_name)}
            helperText={formik.touched.school_name && formik.errors.school_name}
            sx={{
              input: { color: "#333333" },
              backgroundColor: "#FFFFFF",
            }}
          />

          <TextField
            name="owner_name"
            label="Owner Name"
            variant="outlined"
            fullWidth
            value={formik.values.owner_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.owner_name && Boolean(formik.errors.owner_name)}
            helperText={formik.touched.owner_name && formik.errors.owner_name}
            sx={{
              input: { color: "#333333" },
              backgroundColor: "#FFFFFF",
            }}
          />

          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              input: { color: "#333333" },
              backgroundColor: "#FFFFFF",
            }}
          />

          <TextField
            name="password"
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              input: { color: "#333333" },
              backgroundColor: "#FFFFFF",
            }}
          />

          <TextField
            name="confirm_password"
            type="password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={formik.values.confirm_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
            helperText={formik.touched.confirm_password && formik.errors.confirm_password}
            sx={{
              input: { color: "#333333" },
              backgroundColor: "#FFFFFF",
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              width: "100%",
              backgroundColor: "#1976d2",
              color: "#fff",
              ":hover": { backgroundColor: "#115293" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
    </>
  );
}
