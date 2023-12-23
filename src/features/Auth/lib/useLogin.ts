import { FormikHelpers, useFormik } from "formik";
import { BaseResponseType } from "common/types";
import { LoginParamsType } from "features/Auth/ui/login/Login";
import { useActions } from "common/hooks/useActions";
import { authThunks } from "features/Auth/model/auth.reducer";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "features/Auth/model/auth.selectors";

export const useLogin = () => {

  const { login } = useActions(authThunks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorsType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more";
      }
      debugger

      if (!values.captcha) {
        errors.captcha = "Captcha is required";
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      captcha: ''
    },

    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {


      login(values)
        // @ts-ignore
        .unwrap()
        .catch((error: BaseResponseType) => {
          error.fieldsErrors?.forEach(fieldError => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error);
          });
        });
    }
  });

  return { formik, isLoggedIn }
}

type FormikErrorsType = Partial<LoginParamsType>
