import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCourseFile } from 'apiSdk/course-files';
import { Error } from 'components/error';
import { courseFileValidationSchema } from 'validationSchema/course-files';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { CourseFileInterface } from 'interfaces/course-file';

function CourseFileCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CourseFileInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCourseFile(values);
      resetForm();
      router.push('/course-files');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CourseFileInterface>({
    initialValues: {
      file_name: '',
      file_type: '',
      file_path: '',
      upload_date: new Date(new Date().toDateString()),
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: courseFileValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Course File
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="file_name" mb="4" isInvalid={!!formik.errors?.file_name}>
            <FormLabel>File Name</FormLabel>
            <Input type="text" name="file_name" value={formik.values?.file_name} onChange={formik.handleChange} />
            {formik.errors.file_name && <FormErrorMessage>{formik.errors?.file_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="file_type" mb="4" isInvalid={!!formik.errors?.file_type}>
            <FormLabel>File Type</FormLabel>
            <Input type="text" name="file_type" value={formik.values?.file_type} onChange={formik.handleChange} />
            {formik.errors.file_type && <FormErrorMessage>{formik.errors?.file_type}</FormErrorMessage>}
          </FormControl>
          <FormControl id="file_path" mb="4" isInvalid={!!formik.errors?.file_path}>
            <FormLabel>File Path</FormLabel>
            <Input type="text" name="file_path" value={formik.values?.file_path} onChange={formik.handleChange} />
            {formik.errors.file_path && <FormErrorMessage>{formik.errors?.file_path}</FormErrorMessage>}
          </FormControl>
          <FormControl id="upload_date" mb="4">
            <FormLabel>Upload Date</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.upload_date ? new Date(formik.values?.upload_date) : null}
                onChange={(value: Date) => formik.setFieldValue('upload_date', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'course_file',
  operation: AccessOperationEnum.CREATE,
})(CourseFileCreatePage);
