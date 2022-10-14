import React, { FC } from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import { useList } from 'react-firebase-hooks/database'
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
    combinedJson: string
    setCodeCallback: (code: string) => void
}

const saveToDatabase = (tco_json: string) => {
    const projectsRef = firebase.database().ref("projects")
    const projectName = JSON.parse(tco_json).projectName

    // use ProjectName as DB key 
    const key = projectName.replace(/ /g, '-')

    projectsRef.child(key).set({
        date_created: new Date().toString(),
        date_updated: new Date().toString(),
        proj_name: projectName,
        tco_json: tco_json,
    });
}

const onSaveButton = (tco_json: string): void => {
    const projectsRef = firebase.database().ref("projects")
    const projectName = JSON.parse(tco_json).projectName
    // use ProjectName as DB key 
    const key = projectName.replace(/ /g, '-')

    projectsRef.once("value")
        .then(function (snapshot) {
            if (snapshot.child(key).exists()) {
                console.log("Key/Project already exists!")
                confirmAlert({
                    customUI: ({ onClose }) => {
                        return (
                            <div className='w-fit max-h-full mx-auto p-6 bg-white rounded-lg shadow-md overflow-auto flex flex-col'>
                                <div className="text-xl text-center font-bold">Overwrite?</div>
                                <span className="my-8">Saving will overwrite<span className='text-terracotta'> {projectName}</span>.
                                    <br />To save as a new TCO, modify the Project Name.</span>
                                <div className="flex h-8">
                                    <button
                                        className="btn-secondary flex-1 -w-1/2 py-1"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-primary flex-1 w-1/2 py-1 ml-4"
                                        onClick={() => {
                                            saveToDatabase(tco_json)
                                            onClose();
                                        }}
                                    >
                                        Yes!
                                    </button>
                                </div>
                            </div>
                        );
                    }
                });
            } else {
                saveToDatabase(tco_json)
            }
        });
}

const deleteFromDatabase = (key: string) => {
    const projectsRef = firebase.database().ref("projects")
    projectsRef.child(key).remove()
}

const onDeleteButton = (projectName: string, key: string) => {
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
                <div className='w-96 max-h-full mx-auto p-6 bg-white rounded-lg shadow-md overflow-auto flex flex-col'>
                    <div className="text-xl text-center font-bold">Are you sure?</div>
                    <span className="my-8">Do you want to delete <span className='text-terracotta'>{projectName}</span>?</span>
                    <div className="flex h-8">
                        <button
                            className="btn-secondary flex-1 -w-1/2 py-1"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary flex-1 w-1/2 py-1 ml-4"
                            onClick={() => {
                                deleteFromDatabase(key)
                                onClose();
                            }}
                        >
                            Yes, delete!
                        </button>
                    </div>
                </div>
            );
        }
    });
}

const TCODatabase: FC<Props> = (props) => {
    const [snapshots, loading, error] = useList(firebase.database().ref('projects').orderByChild("date_updated"));

    return (
        <>
            <div className="text-gray-2 text-sm pb-1">TCO Database</div>
            <div className="btn-tertiary text-center"
                onClick={() => onSaveButton(props.combinedJson)}>
                Save TCO
            </div>
            <div>
                {error && <strong>Error: {error}</strong>}
                {loading && <span>Loading...</span>}
                {snapshots &&
                    snapshots.map((v) => (
                        <div key={v.key}>
                            <AnimatePresence>
                                {(<motion.div
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                >
                                    <div className="flex">
                                        <div
                                            className="flex-1 rounded border border-gray-5 text-gray-3 p-1 mt-1 text-center text-xs hover:bg-gray-6 active:bg-gray-5 select-none cursor-pointer"
                                            onClick={() => props.setCodeCallback(v.child("tco_json").val())}
                                        >
                                            {v.child("proj_name").val()} Last Updated {moment(v.child("date_updated").val()).fromNow()}
                                        </div>
                                        <div
                                            className="w-6 p-1 ml-1 mt-1  rounded border border-terracotta text-terracotta text-center text-xs hover:bg-gray-6 active:bg-gray-5 select-none cursor-pointer"
                                            onClick={() => onDeleteButton(v.child("proj_name").val(), v.key || "")}>
                                            -
                                        </div>
                                    </div>
                                </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                }
            </div >
        </>
    )
}

export { TCODatabase, onSaveButton }