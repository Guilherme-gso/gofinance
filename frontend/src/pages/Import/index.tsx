import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [error, setError] = useState('');

  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    if (!uploadedFiles.length) {
      setError('Nenhum arquivo foi selecionado');
      return;
    }

    data.append('file', uploadedFiles[0].file, uploadedFiles[0].name);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      setError('Houve um erro ao fazer o upload do arquivo.');
    }
  }

  function submitFile(files: File[]): void {
    const uploadCsv = files.map((file: File) => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadCsv);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>

          {error && <Error>{error}</Error>}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
