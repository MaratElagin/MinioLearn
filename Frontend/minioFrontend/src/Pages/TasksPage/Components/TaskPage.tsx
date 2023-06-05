import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PhotoUpload from './PhotoUpload';
import PhotoList, { Photo } from './PhotoList';
import axios from "axios";

const TaskPage: React.FC = () => {
    const { taskId } = useParams<{ taskId?: string }>();
    const parsedTaskId = taskId ? parseInt(taskId, 10) : undefined;
    const task = tasks.find((t) => t.id === parsedTaskId);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [photos, setPhotos] = useState<Photo[]>([]);

    const handleSubmission = async () => {
        setIsSubmitted(true);
        try {
            const response = await axios.get(`http://localhost:5143/HomeworkPhotos/${taskId}`);
            setPhotos(response.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`http://localhost:5143/HomeworkPhotos/${taskId}`);
                setPhotos(response.data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        if (taskId) {
            fetchPhotos();
        }
    }, [taskId]);

    return (
        <div>
            <h2>
                {taskId}. {task?.name}
            </h2>
            <div className="task-text-box">
                <div className="task-text">{task?.text}</div>
            </div>
            <div className="photo-upload">
                {!isSubmitted && photos.length === 0 && (
                    <PhotoUpload onSubmission={handleSubmission} taskId={parsedTaskId ?? 0} />
                )}
            </div>
            {(isSubmitted || photos.length > 0) && <PhotoList photos={photos} setPhotos={setPhotos} />}
        </div>
    );
};

type Task = {
    id: number;
    name: string;
    text: string;
}

const tasks : Task[] = [
    {
        id: 1,
        name: "Ковбой Джон и шериф",
        text: "Ковбой Джон увез из поселка в грузовом пикапе элитного жеребенка. Через час и 12 минут вслед за ним выехал шериф на джипе черроки.\n" +
            "Через 0,8 ч после своего выезда шериф отставал от грузового пикапа на 24 км. Найдите скорость джипа, если известно, что она больше скорости грузового пикапа на 30 км/ч. Через сколько минут джип шерифа догонит грузовой пикап?"
    },
    {
        id: 2,
        name: "Царь Салтан и 2 башни",
        text: "Царю Салтану потребовалось возвести для обороны крепости две одинаковые баши. Работу взялись выполнять две бригады, состоящие из семи и девяти гномов, работающих одинаково. Царь обещал удвоить оплату, если бригады справятся с задачей за одинаковое время. Тогда через 9 дней после начала работы в первую бригаду перешли 4 гнома из второй. В итоге обе баши были построены одновременно. Сколько дней длилась стройка?"
    },
    {
        id: 3,
        name: "Прикольные числа и рыбка Дори",
        text: "Назовем два числа прикольными, если одно получается из другого перестановкой своих цифр. Рыбка Дори посчитала произведение двух прикольных чисел - оно оказалось равным 6624. Через секунду она забыла эти числа. Помогите рыбке вспомнить загаданные числа и убедите ее, что других таких чисел пет."
    }
]

export default TaskPage;
