import React, { useState, useEffect, useReducer } from "react";
import "./TodoList.css";
interface Todo {
  id: number;
  name: string;
}

export default function TodoList() {
  const initial = {
    todos: [],
    isloading: false,
    todo: {
      id: 0,
      name: "",
      status: false,
    },
  };

  // Khởi tạo hàm useReducer
  const reducer = (state: any = initial, action: any) => {
    switch (action.type) {
      case "CHANGE-INPUT":
        return {
          ...state,
          todo: {
            ...state.todo,
            name: action.payload,
          },
        };
      case "HANDLE-ADD":
        const existingTodoIndex = state.todos.findIndex(
          (todo: Todo) => todo.id === action.payload.id
        );
        let updatedTodos;
        if (existingTodoIndex >= 0) {
          updatedTodos = state.todos.map((todo: Todo, index: number) =>
            index === existingTodoIndex ? action.payload : todo
          );
        } else {
          updatedTodos = [
            ...state.todos,
            { ...action.payload, id: Date.now() },
          ];
        }
        localStorage.setItem("todos", JSON.stringify(updatedTodos));
        return { ...state, todos: updatedTodos, todo: initial.todo };
      case "LOAD-TODOS":
        return { ...state, todos: action.payload };
      case "HANDLE-DELETE":
        const filteredTodos = state.todos.filter(
          (todo: Todo) => todo.id !== action.payload
        );
        localStorage.setItem("todos", JSON.stringify(filteredTodos));
        return { ...state, todos: filteredTodos };
      case "HANDLE-FIX":
        return { ...state, todo: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initial);

  // lấy giá trị ô input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    dispatch(action("CHANGE-INPUT", inputValue));
  };
  // lấy giá trị ô input checkbox
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  // khởi tao hàm tạo action
  const action = (type: string, payload: any): any => {
    return {
      type: type,
      payload: payload,
    };
  };

  // khai báo hàm thêm công việc
  const handleAdd = () => {
    if (state.todo.name.trim() === "") return;
    dispatch(action("HANDLE-ADD", state.todo));
  };

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      dispatch(action("LOAD-TODOS", JSON.parse(savedTodos)));
    }
  }, []);

  // xoá
  const handleDelete = (id: number) => {
    dispatch(action("HANDLE-DELETE", id));
  };

  // sửa
  const handleFix = (todo: Todo) => {
    dispatch(action("HANDLE-FIX", todo));
  };
  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="card-body p-5">
                  <form className="d-flex justify-content-center align-items-center mb-4">
                    <div className="form-outline flex-fill">
                      <input
                        type="text"
                        id="form2"
                        className="form-control"
                        onChange={handleChange}
                      />
                      <label className="form-label" htmlFor="form2">
                        Nhập tên công việc
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-info ms-2"
                      onClick={handleAdd}
                    >
                      {state.todo.id === 0 ? "thêm " : "sửa "}
                    </button>
                  </form>
                  {/* Tabs navs */}
                  <ul className="nav nav-tabs mb-4 pb-2">
                    <li className="nav-item" role="presentation">
                      <a className="nav-link active">Tất cả</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Đã hoàn thành</a>
                    </li>
                    <li className="nav-item" role="presentation">
                      <a className="nav-link">Chưa hoàn thành</a>
                    </li>
                  </ul>
                  {/* Tabs navs */}
                  {/* Tabs content */}
                  <div className="tab-content" id="ex1-content">
                    <div className="tab-pane fade show active">
                      <ul className="list-group mb-0">
                        {state.todos.map((item: Todo) => {
                          return (
                            <li
                              key={item.id}
                              className="list-group-item d-flex align-items-center justify-content-between border-0 mb-2 rounded"
                              style={{ backgroundColor: "#f4f6f7" }}
                            >
                              <div>
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={handleCheckboxChange}
                                />
                                <p>
                                  {isChecked ? (
                                    <s>{item.name}</s>
                                  ) : (
                                    <p>{item.name}</p>
                                  )}
                                </p>
                              </div>
                              <div className="d-flex gap-3">
                                <i
                                  className="fas fa-pen-to-square text-warning"
                                  onClick={() => handleFix(item)}
                                />
                                <i
                                  className="far fa-trash-can text-danger"
                                  onClick={() => handleDelete(item.id)}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Modal xác nhận xóa */}
      {/* <div className="overlay" hidden="">
            <div className="modal-custom">
            <div className="modal-header-custom">
                <h5>Xác nhận</h5>
                <i className="fas fa-xmark" />
            </div>
            <div className="modal-body-custom">
                <p>Bạn chắc chắn muốn xóa công việc quét nhà?</p>
            </div>
            <div className="modal-footer-footer">
                <button className="btn btn-light">Hủy</button>
                <button className="btn btn-danger">Xóa</button>
            </div>
            </div>
        </div> */}
      {/* Modal cảnh báo lỗi */}
      {/* <div className="overlay" hidden="">
            <div className="modal-custom">
            <div className="modal-header-custom">
                <h5>Cảnh báo</h5>
                <i className="fas fa-xmark" />
            </div>
            <div className="modal-body-custom">
                <p>Tên công việc không được phép để trống.</p>
            </div>
            <div className="modal-footer-footer">
                <button className="btn btn-light">Đóng</button>
            </div>
            </div>
        </div> */}
    </>
  );
}
