import React from 'react';
import axios from 'axios';

export interface Photo {
    homeworkPhoto: {
        key: string;
    };
    previewUrl: string;
}

interface PhotoListProps {
    photos: Photo[];
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
}

const PhotoList: React.FC<PhotoListProps> = ({ photos, setPhotos }) => {
    const handleDelete = (fileName: string) => {
        axios
            .delete(`http://localhost:5143/HomeworkPhotos/delete/${fileName}`)
            .then((response) => {
                console.log('Photo deleted successfully');
                setPhotos((prevPhotos) =>
                    prevPhotos.filter((photo) => photo.homeworkPhoto.key !== fileName)
                );
            })
            .catch((error) => {
                console.error('Error deleting photo:', error);
            });
    };

    return (
        <div className="photo-list">
            {photos.map((photo, index) => (
                <div className="photo-card" key={index}>
                    <img className="photo-image" src={photo.previewUrl} alt="Preview" />
                    <div className="photo-content">
                        <div className="photo-label">{photo.homeworkPhoto.key}</div>
                        <button
                            className="delete-button"
                            onClick={() => handleDelete(photo.homeworkPhoto.key)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PhotoList;
