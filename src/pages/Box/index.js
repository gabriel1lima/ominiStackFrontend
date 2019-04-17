import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import socket from "socket.io-client";
import "./styles.css";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box_id = this.props.match.params.id;
    const response = await api.get(`boxes/${box_id}`);

    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const box_id = this.props.match.params.id;
    const io = socket("https://semana-omnistackbackend.herokuapp.com");

    io.emit("connectionRoom", box_id);

    io.on("file", data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box_id = this.props.match.params.id;

      data.append("file", file);
      api.post(`boxes/${box_id}/files`, data);
    });
  };

  render() {
    const { box } = this.state;

    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Arraste arquivos ou clique aqui!</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {box.files &&
            box.files.map(file => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#ASCfff" />
                  <strong>{file.title}</strong>
                </a>

                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
