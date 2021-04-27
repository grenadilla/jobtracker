import { useAuth0 } from "@auth0/auth0-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row, Button} from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import * as yup from 'yup';

import { addUserSkills, createUser, getAllSkills, getCurrentUser, getCurrentUserSkills, updateUser, updateUserSkills } from "../../utils/api";
import Input from "../../utils/form/Input";
import Select from "../../utils/form/Select";
import styles from './styles.module.scss';

const schema = yup.object().shape({
  name: yup.string().required(),
  gpa: yup.number().min(0).max(4).required(),
  grade: yup.number().oneOf([0,1,2,3]).required(),
  skills: yup.array().of(yup.number()),
});

const gradeOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior']
  .map((grade, index) => ({ label: grade, value: index }));

const SignUp = ({ update = false }) => {
  const { user } = useAuth0();
  const [skillOptions, setSkillOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useLocation();
  const history = useHistory();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const params = new URLSearchParams(search);
  const redirectTo = params.get('redirect_to') || '/';

  useEffect(() => {
    getAllSkills().then(allSkills => {
      setSkillOptions(allSkills.map(({ id, name }) => ({ label: name, value: id })));
    })
  }, []);

  useEffect(() => {
    // if `update` is false, we only want to run `initializeSkills`, otherwise we also want to run `initializeUserData`

    const initializeSkills = async () => {
      const allSkills = await getAllSkills();
      setSkillOptions(allSkills.map(({ id, name }) => ({ label: name, value: id })));
    };

    const initializeUserData = async () => {
      const { name, gpa, grade } = await getCurrentUser();
      const skills = await getCurrentUserSkills();
      methods.reset({ name, gpa, grade, skills });
    }

    setIsLoading(true);
    const promises = [initializeSkills()];
    if (update) {
      methods.reset({});
      promises.push(initializeUserData());
    } else {
      methods.reset({ name: user.name });
    }
    
    Promise.all(promises)
      .catch(err => alert(err))
      .finally(() => setIsLoading(false));
  }, [update]);

  const onSubmit = async ({ name, gpa, grade, skills }) => {
    try {
      setIsLoading(true);
      if (update) {
        await updateUser({ name, grade, gpa });
        await updateUserSkills(skills);
      } else {
        await createUser({ email: user.email, name, grade, gpa });
        await addUserSkills(skills);
      }
      history.push(redirectTo);
    } catch (err) {
      const action = update ? 'edit profile' : 'sign up';
      alert(`Failed to ${action}.\n\nError: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className={styles.signup}>
      <Row className={styles.row}>
        <Col />

        <Col sm="8" md="6">
          <Card>
            <Card.Body>
              <h3 className={styles.title}>{update ? "Edit Profile" : "Sign Up"}</h3>
              <FormProvider {...methods}>
                <Form action="" onSubmit={methods.handleSubmit(onSubmit)}>
                  <Input name="name" placeholder="Name" />
                  <Input name="gpa" type="number" min="0" max="4" step=".1" placeholder="GPA" />
                  <Select name="grade" options={gradeOptions} placeholder="Grade" />
                  <Select name="skills" options={skillOptions} placeholder="Skills" isLoading={skillOptions.length === 0} isMulti />
                  <Button type="submit" disabled={isLoading} block>{isLoading ? 'Loading...' : 'Submit'}</Button>
                  <Button type="button" variant="secondary" onClick={() => history.push('/')} block>Cancel</Button>
                </Form>
              </FormProvider>
            </Card.Body>
          </Card>
        </Col>

        <Col />
      </Row>
    </Container>
  )
};

export default SignUp;
