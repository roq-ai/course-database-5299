import * as yup from 'yup';

export const courseFileValidationSchema = yup.object().shape({
  file_name: yup.string().required(),
  file_type: yup.string().required(),
  file_path: yup.string().required(),
  upload_date: yup.date().required(),
  organization_id: yup.string().nullable(),
});
