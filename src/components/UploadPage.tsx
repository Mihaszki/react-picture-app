import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { uploadPost } from '../services/PostService';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import NavMenu from './NavMenu';

const UploadPage = () => {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
    }
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null) as any;

  const handleDrop = (ev: any) => {
    if(isLoading) {return;}
    setFileName('');
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.dataTransfer.items) {
      [...ev.dataTransfer.items].forEach((item, i) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          console.log(`… file[${i}].name = ${file.name}`);
          setFile(file);
          setFileName(`${file.name}`);
        }
      });
    } else {
      [...ev.dataTransfer.files].forEach((file, i) => {
        console.log(`… file[${i}].name = ${file.name}`);
        setFile(file);
        setFileName(`${file.name}`);
      });
    }
  };

  const handleChange = (e: any) => {
    if(isLoading) {return;}
    setFileName('');
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
      setFileName(`${e.target.files[0].name}`);
    }
  };

  const handleDrag = (e: any) => {
    if(isLoading) {return;}
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onSubmit = async () => {
    if(isLoading) {return;}
    setErrorMsg('');
    setIsLoading(true);
    if (!file) {
      setIsLoading(false);
      return setErrorMsg('You must upload a photo');
    }

    try {
      const ext = fileName.split('.').pop();
      console.log(ext);
      if ((file.type !== 'image/png' && file.type !== 'image/jpeg') ||
        (ext !== 'jpg' && ext !== 'png')) {
        setIsLoading(false);
        return setErrorMsg('You must upload a valid file');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return setErrorMsg('Invalid file extension');
    }

    try {
      const upload = await uploadPost(file, getValues('title'), fileName);
      const data = await upload.json();
      setIsLoading(false); 
      if(data.success === false) {
        setErrorMsg(data.message);
      }
      else {
        console.log(data);
        navigate(`/view/${data.saved._id}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMsg(`Server Error!`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavMenu />
      <section className="w-full sm:w-3/4 md:w-2/4 py-20 mx-auto">
        <form onSubmit={handleSubmit(() => { onSubmit() })} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className="rounded-xl bg-white px-10 py-14 md:drop-shadow-lg" noValidate>
          <h1 className="text-center mb-6 text-xl lg:text-2xl">Upload Image</h1>
          <div className="relative z-0 mb-6 w-full group">
            <input disabled={isLoading} type="text" {...register("title", { required: 'Title is required!', minLength: { value: 6, message: 'Title is too short!' } })} name="title" id="title" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
            <label htmlFor="title" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title</label>
          </div>

          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className={(dragActive || fileName !== '' ? "drag-active " : "") + "transition-all ease-in-out flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                {
                  fileName === '' ?
                    <>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG or JPG</p>
                    </>
                    :
                    <>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{fileName}</span></p>
                      <p className="text-xs text-gray-500 text-transparent">-</p>
                    </>
                }
              </div>
              <input id="dropzone-file" type="file" multiple={false} className="hidden" disabled={isLoading} onChange={handleChange} />
            </label>
          </div>
          <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.title?.message}</p></div>
          <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errorMsg}</p></div>
          <button type="submit" className="text-white mx-auto block transition-colors shadow-md ease-in-out mt-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
            {!isLoading ? 'Upload' : <LoadingSpinner />}
          </button>
        </form>
      </section>
      <Footer />
    </>
  )
}

export default UploadPage