import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPauseCircle, FaTrash, FaPlay, FaStop } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from 'wavesurfer.js'

function CaptureAudio({ hide, user }) {

    const formatTime = (time) => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')
            }`
    };

    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [waveform, setWaveform] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderedAudio, setRenderedAudio] = useState(null);

    const audioRef = useRef(null);
    const mediaRecorderRed = useRef(null);
    const waveFormRef = useRef(null);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration((prevDuration) => {
                    setTotalDuration(prevDuration + 1);
                    return prevDuration + 1;
                });
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    useEffect(() => {
        const wavesurfer = WaveSurfer.create({
            container: waveFormRef.current,
            waveColor: '#ccc',
            progressColor: '#4a9eff',
            cursorColor: '#7ae3c3',
            barWidth: 2,
            height: 30,
            responsive: true,
        });
        setWaveform(wavesurfer);

        wavesurfer.on('finish', () => {
            setIsPlaying(false);
        });
        return () => {
            wavesurfer.destroy();
        };
    }, []);


    useEffect(() => {
        if (waveform) handleStartRecording();
    }, [waveform]);
    const handleStartRecording = () => {
        setRecordingDuration(0);
        setCurrentPlaybackTime(0);
        setTotalDuration(0);
        setIsRecording(true);
        setRecordedAudio(null);
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRed.current = mediaRecorder;
            audioRef.current.srcObject = stream;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                const audioURL = URL.createObjectURL(blob);
                setRecordedAudio(blob);

                waveform.load(audioURL);
            };
            mediaRecorder.start();
        })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };


    const handleStopRecording = () => {
        if (mediaRecorderRed.current && isRecording) {
            mediaRecorderRed.current.stop();
            setIsRecording(false);
            waveform.stop();

            const audioChunks = [];
            mediaRecorderRed.current.addEventListener('dataavailable', (event) => {
                audioChunks.push(event.data);
            });
            mediaRecorderRed.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
                const audioFile = new File([audioBlob], 'recording.mp3');
                const audioElement = new Audio(URL.createObjectURL(audioFile));
                setRecordedAudio(audioElement);
            });
        }
    };


    useEffect(() => {
        if (recordedAudio) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(recordedAudio.currentTime);
            };
            recordedAudio.addEventListener('timeupdate', updatePlaybackTime);
            return () => {
                recordedAudio.removeEventListener('timeupdate', updatePlaybackTime);
            }
        }
    }, [recordedAudio]);

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveform.play();
            recordedAudio.play();
            setIsPlaying(true);
        }
    };

    const handlePauseRecording = () => {
        if (recordedAudio) {
            recordedAudio.pause();
            waveform.stop();
            setIsPlaying(false);
        }
    };

    // const sendRecording = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('audio', renderedAudio);
    //         const response = await axios.post({
    //             header: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //             params: {
    //                 from: user.id,
    //                 to: currentChatUser.id,
    //             },
    //         });
    //         if (response.status === 201) {
    //             Socket.current.emit("send-msg", {
    //                 to: useRouteId,
    //                 from: useRouteId,
    //                 message: response.data.message,
    //             });
    //             dispatch({
    //                 type: reducerCases.ADD_MESSAGE,
    //                 newMessage: {
    //                     ...response.data.message,
    //                 },
    //                 fromSelf: true,
    //             })
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const sendRecording = async () => {
        try {
            if (!renderedAudio) {
                console.error('No recorded audio to send.');
                return;
            }
    
            const formData = new FormData();
            formData.append('audio', renderedAudio);
            formData.append('user_id', user.id); 
    
            const response = await axios.post('http://localhost:5000/upload-audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                console.log('Audio recording successfully sent and saved in the database.');
            }
        } catch (err) {
            console.error('Error sending audio recording:', err);
        }
    };    

    return (
        <div className='capture-audio-container'>
            <div className='trash-icon'>
                <FaTrash className="test-panel-header-icon" onClick={() => hide()} />
            </div>
            <div className='control-bar'>
                {isRecording ? (
                    <div className='capture-audio-time'>
                        Recording<span>{recordingDuration}s</span>
                    </div>
                ) : (
                    <div className='play-stop-audio'>
                        {
                            recordedAudio &&
                            <>
                                {!isPlaying ? <FaPlay onClick={handlePlayRecording} /> : <FaStop onClick={handlePauseRecording} />}
                            </>
                        }
                    </div>
                )}
                <div className='capture-audio-wave' ref={waveFormRef} hidden={isRecording} />
                {recordedAudio && isPlaying && (
                    <span className='capture-audio-wave-span'>{formatTime(currentPlaybackTime)}</span>
                )}
                {recordedAudio && !isPlaying && (
                    <span className='capture-audio-wave-span'>{formatTime(totalDuration)}</span>
                )}
                <audio ref={audioRef} hidden />
            </div>
            <div className='capture-audio-recording'>
                {!isRecording ? (
                    <FaMicrophone
                        className='capture-audio-microphone'
                        onClick={handleStartRecording}
                    />
                ) : (
                    <FaPauseCircle
                        className='capture-audio-pause'
                        onClick={handleStopRecording}
                    />
                )}
            </div>
            <div className='audio-capture-send'>
                <MdSend
                    className='text-panel-header-icon'
                    title="Send"
                    onClick={sendRecording}
                />
            </div>
        </div>
    );
};

export default CaptureAudio;
