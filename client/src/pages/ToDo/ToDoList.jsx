import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import styles from './ToDoList.module.css';
import { Button, Input, Modal, Divider, message, Tag, Tooltip, Select, Empty } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import ToDoService from '../../services/toDoServices';
import { getUserDetails } from '../../util/GetUser';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';

function ToDoList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [currentTaskType, setCurrentTaskType] = useState('incomplete');
  const [completedTodo, setCompletedTodo] = useState([]);
  const [incompletedTodo, setIncompletedTodo] = useState([]);
  const [currentTodoTask, setCurrentTodoTask] = useState([]);
  const [filteredToDo, setFilteredToDo] = useState([]);

  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState(false);

  const fetchTodos = async () => {
    try {
      const user = getUserDetails();
      const response = await ToDoService.getAllToDo(user.userId);
      setTodos(response.data);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    const user = getUserDetails();
    if (user && user.userId) {
      fetchTodos();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const incomplete = todos.filter((item) => item.isCompleted === false);
    const complete = todos.filter((item) => item.isCompleted === true);

    setIncompletedTodo(incomplete);
    setCompletedTodo(complete);

    if (currentTaskType === 'incomplete') {
      setCurrentTodoTask(incomplete);
    } else {
      setCurrentTodoTask(complete);
    }
  }, [todos, currentTaskType]);

  const handleSubmitTask = async () => {
    if (!title) return message.error('Title is required!');
    setLoading(true);
    try {
      const user = getUserDetails();
      await ToDoService.createToDo({ title, description, userId: user.userId });
      message.success('Task added!');
      setTitle('');
      setDescription('');
      setIsAdding(false);
      fetchTodos();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setUpdatedTitle(item.title);
    setUpdatedDescription(item.description);
    setUpdatedStatus(item.isCompleted);
    setIsEditing(true);
  };

  const handleUpdateTask = async () => {
    setLoading(true);
    try {
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedStatus
      };
      await ToDoService.updateToDo(currentEditItem._id, data);
      message.success('Task Updated!');
      setIsEditing(false);
      fetchTodos();
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      await ToDoService.deleteToDo(item._id);
      setTodos((prev) => prev.filter((t) => t._id !== item._id));
      message.success('Deleted');
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (item) => {
    try {
      await ToDoService.updateToDo(item._id, {
        ...item,
        isCompleted: !item.isCompleted
      });
      fetchTodos();
      message.success('Status Updated');
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const getFormattedDate = (value) => {
    const date = new Date(value);
    return `${date.toDateString()} at ${date.getHours()}:${date.getMinutes()}`;
  };

  const handleTypeChange = (value) => {
    setCurrentTaskType(value);
    if (value === 'incomplete') {
      setCurrentTodoTask(incompletedTodo);
    } else {
      setCurrentTodoTask(completedTodo);
    }
    setFilteredToDo([]);
  };

  const handleSearch = (e) => {
    let query = e.target.value.toLowerCase();
    let filteredList = currentTodoTask.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    if (query) {
      setFilteredToDo(filteredList);
    } else {
      setFilteredToDo([]);
    }
  };

  return (
    <>
      <Navbar />
      <section className={styles.toDoWrapper}>
        <div className={styles.toDoHeader}>
          <h2>Your Tasks</h2>
          <Input placeholder="Search..." style={{ width: '50%' }} onChange={handleSearch} />
          <Button type="primary" onClick={() => setIsAdding(true)}>Add Task</Button>
          <Select
            value={currentTaskType}
            style={{ width: 180, marginLeft: '10px' }}
            onChange={handleTypeChange}
            options={[
              { value: 'incomplete', label: 'Incomplete' },
              { value: 'complete', label: 'Complete' }
            ]}
          />
        </div>

        <Divider />

        <div className={styles.toDoListCardWrapper}>
          {(filteredToDo.length > 0 ? filteredToDo : currentTodoTask).length > 0 ? (
            (filteredToDo.length > 0 ? filteredToDo : currentTodoTask).map((item) => {
              return (
                <div key={item?._id} className={styles.toDoCard}>
                  <div className={styles.toDoCardHeader}>
                    <h3>{item?.title}</h3>
                    <Tag color={item?.isCompleted ? 'cyan' : 'red'}>
                      {item?.isCompleted ? 'Completed' : 'Incomplete'}
                    </Tag>
                  </div>

                  <p>{item?.description}</p>

                  <div className={styles.toDoCardFooter}>
                    <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                    <div className={styles.toDoCardFooterAction}>
                      <Tooltip title="Edit">
                        <EditOutlined onClick={() => handleEdit(item)} className={styles.actionIcon} />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => handleDelete(item)} style={{ color: 'red' }} className={styles.actionIcon} />
                      </Tooltip>
                      <Tooltip title={item?.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}>
                        {item?.isCompleted ? (
                          <CloseCircleFilled onClick={() => handleUpdateStatus(item)} className={styles.actionIcon} />
                        ) : (
                          <CheckCircleFilled onClick={() => handleUpdateStatus(item)} className={styles.actionIcon} />
                        )}
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noTaskWrapper}>
              <Empty />
            </div>
          )}
        </div>

        <Modal
          title="Add Task"
          open={isAdding}
          onOk={handleSubmitTask}
          onCancel={() => setIsAdding(false)}
          confirmLoading={loading}
        >
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <Input.TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Modal>

        <Modal
          title={`Update ${currentEditItem?.title}`}
          open={isEditing}
          onOk={handleUpdateTask}
          onCancel={() => setIsEditing(false)}
          confirmLoading={loading}
        >
          <Input
            style={{ marginBottom: '1rem' }}
            placeholder="Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <Input.TextArea
            style={{ marginBottom: '1rem' }}
            placeholder="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <Select
            style={{ width: '100%' }}
            value={updatedStatus}
            onChange={(val) => setUpdatedStatus(val)}
            options={[
              { value: false, label: 'Not Completed' },
              { value: true, label: 'Completed' }
            ]}
          />
        </Modal>
      </section>
    </>
  );
}

export default ToDoList;