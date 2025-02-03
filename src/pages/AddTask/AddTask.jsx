import { useState, useRef } from "react";
import MainButton from "../../components/buttons/MainButton/MainButton.jsx";
import "./AddTask.css";
import { storage } from "../../api/firebase"; // Firebase storage import
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { useTask } from "../../hooks/useTask.js";
import { useAuth } from "../../hooks/useAuth.js";
import { uploadIcon } from "../../assets/index.js";

// Desteklenen resim türleri ve boyut limiti
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddTask({ onClose }) {
    const [priority, setPriority] = useState("Low");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const currentUser = useAuth();
    
    const { addTask } = useTask();

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (!file) return;

        // Dosya türü kontrolü
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Lütfen geçerli bir resim dosyası seçin (PNG, JPG veya GIF)');
            return;
        }

        // Dosya boyutu kontrolü
        if (file.size > MAX_FILE_SIZE) {
            toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
            return;
        }

        // Resim önizleme
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        setImageFile(file);
    };

    const uploadImage = async (file) => {
        if (!file) return null;

        const fileExtension = file.name.split('.').pop();
        const fileName = `${!currentUser?.uid}/task-images/${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, fileName);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Image upload error:', error);
            throw new Error('Resim yüklenirken bir hata oluştu');
        }
    };

    const saveTask = async () => {
        if (!title.trim() || !description.trim() || !date) {
            toast.error("Lütfen tüm alanları doldurun");
            return;
        }

        setIsUploading(true);
        try {
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            await addTask({
                title: title,
                createdOn: new Date(date),
                body: description,
                image: imageUrl,
                priority: priority,
                status: "Not Started",
            });

            toast.success('Görev başarıyla eklendi');
            onClose(true);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

  return (
    <div className="add-task-dialog">
      <div className="add-task-dialog-header">
        <h3 className="add-task-dialog-header-title">Add Task</h3>
        <h4 
          className="add-task-dialog-header-go-back"
          onClick={onClose}
        >
          Go back
        </h4>
      </div>
      <div className="add-task-dialog-body">
        <p className="add-task-dialog-body-title">Title</p>
        <input type="text" className="add-task-dialog-body-title-input" onChange={(e) => setTitle(e.target.value)}/>
        <p className="add-task-dialog-body-date">Date</p>
        <input type="date" placeholder="Date" className="add-task-dialog-body-date-input" onChange={(e) => setDate(e.target.value)}/>
        <p className="add-task-dialog-body-priority">Priority</p>
        <div className="add-task-dialog-priority-container">
          <div className="add-task-dialog-priority-container-low">
            <p>Low</p>
            <input type="checkbox" name="priority" value="Low" checked={priority === "Low"} onChange={() => setPriority("Low")} />
          </div>
          <div className="add-task-dialog-priority-container-moderate">
            <p>Moderate</p>

            <input type="checkbox" name="priority" value="Moderate" checked={priority === "Moderate"} onChange={() => setPriority("Moderate")} />
          </div>
          <div className="add-task-dialog-priority-container-extreme">
            <p>Extreme</p>
            <input type="checkbox" name="priority" value="Extreme" checked={priority === "Extreme"} onChange={() => setPriority("Extreme")} />
          </div>
        </div>
         <div className="add-task-dialog-description-image-container-header">
                    <p className="add-task-dialog-description-image-container-header-title">
                        Task Description
                    </p>
                    <p className="add-task-dialog-description-image-container-header-upload">
                        Upload Image
                    </p>
                </div>
                <div className="add-task-dialog-description-image-container">
                    <textarea
                        placeholder="Task Description"
                        className="add-task-dialog-description-textarea"
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div 
                        className="add-task-dialog-image-input"
                        onClick={handleImageClick}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            className="add-task-dialog-image-input-file"
                            onChange={handleImageChange}
                        />
                        {imagePreview ? (
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '0.5em'
                                }}
                            />
                        ) : (
                            <>
                                <img 
                                    src={uploadIcon} 
                                    alt="upload" 
                                    className="add-task-dialog-image-input-image"
                                />
                                <p className="add-task-dialog-image-input-text">
                                    Click to upload image
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="add-task-dialog-footer">
                <MainButton 
                    text={isUploading ? "Uploading..." : "Done"} 
                    onClick={saveTask}
                    disabled={isUploading}
                />
            </div>
        </div>
    );
}
