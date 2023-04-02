import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import {useRef, useState} from 'react'
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import WarningButton from '@/Components/WarningButton';
import Swal from 'sweetalert2';


export default function Index(props) {
    const [modal,setModal]=useState(false);
    const [title,setTitle]=useState('');
    const [operation,setOperation]=useState(1);
    const NameInput=useRef();
    const DescriptionInput=useRef();
    const CompletedInput=useRef();
    const { data,setData,delete:destroy,post,put,
        processing,reset,errors}=useForm({
        id:'',name:'',
        description:'',
        completed:'',
    })
    const openModal=(op,id,name,description,completed)=>{
        // alert(completed);
        setModal(true);
        setOperation(op);
        setData({id:'',name:'',description:'',completed:''});
        if(op===1){
            setTitle('Añadir tarea');
        }else{
            setTitle('Modificar tarea');
            setData({id:id,name:name,description:description,completed:completed});
        }
    }
    const closeModal=()=>{
        setModal(false);
    }
    const save=(e)=>{
        e.preventDefault();
        if(operation===1){
            post(route('tasks.store'),{
                onSuccess:()=>{ok('Tarea guardada.')},
                onError:()=>{
                    if(errors.name){
                        reset('name');
                        NameInput.current.focus();
                    }
                    if(errors.description){
                        reset('description');
                        DescriptionInput.current.focus();
                    }
                    if(errors.completed){
                        reset('completed');
                        CompletedInput.current.focus();
                    }
                }
            });
        }else{
            put(route('tasks.update',data.id),{
                onSuccess:()=>{ok('Tarea modificada.')},
                onError:()=>{
                    if(errors.name){
                        reset('name');
                        NameInput.current.focus();
                    }
                    if(errors.description){
                        reset('description');
                        DescriptionInput.current.focus();
                    }
                    if(errors.completed){
                        reset('completed');
                        CompletedInput.current.focus();
                    }
                }
            });
        }
    }
    const ok = (mensaje)=>{
        reset();
        closeModal();
        Swal.fire({title:mensaje,icon:'success'});
    }
    const eliminar = (id, name) =>{
        const alerta = Swal.mixin({ buttonsStyling:true});
        alerta.fire({
            title:'Seguro que quieres eliminar la tarea '+name,
            text:'Se perderá la tarea',
            icon:'question', showCancelButton:true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText:'<i class="fa-solid fa-ban"></i> Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                destroy(route('tasks.destroy',id),
                {onSuccess: () =>{ok('Tarea eliminada')}});
            }
        });
    }
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}

        >
            <Head title="Tasks" />

            <div className="bg-black grid v-screen place-items-center">
                <div className="mt-3 mb-3 flex justify-end">
                    <PrimaryButton onClick={()=>openModal(1)}>
                        <i className='fa-solid fa-plus-circle'></i>
                        Añadir tarea
                    </PrimaryButton>
                </div>
            </div>

            <div className="bg-black grid v-screen place-items-center py-6">
                <table className='table-auto border border-gray-400 text-white'>
                    <thead>
                        <tr className='bg-black-100 text-purple-600'>
                            <th className='px-2 py-2'>#</th>
                            <th className='px-2 py-2'>Nombre</th>
                            <th className='px-2 py-2'>Descripcion</th>
                            <th className='px-2 py-2'>Estado</th>
                            <th className='px-2 py-2'></th>
                            <th className='px-2 py-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.tasks.map((task,i) => (
                            <tr key={task.id}>
                                <td className='border border-gray-400 px-2 py-2'>{(i+1)}</td>
                                <td className='border border-gray-400 px-2 py-2'>{task.name}</td>
                                <td className='border border-gray-400 px-2 py-2'>{task.description}</td>
                                <td className='border border-gray-400 px-2 py-2'>
                                    {task.completed ? 'Completada' : ''}
                                </td>
                                <td className='border border-gray-400 px-2 py-2'>
                                    <WarningButton
                                     onClick={
                                        ()=>openModal(2,task.id,task.name,task.description,task.completed)
                                    }>
                                        <i className='fa-solid fa-edit'></i>
                                    </WarningButton>
                                </td>
                                <td className='border border-gray-400 px-2 py-2'>
                                    <DangerButton
                                    onClick={() => eliminar(task.id,task.name)}>
                                        <i className='fa-solid fa-trash'></i>
                                    </DangerButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={modal} onClose={closeModal}>
                <h2 className="p-3 text-lg font-medium text-gray-900">
                    {title}
                </h2>
                <form onSubmit={save} className="p-6">

                    <div className='mt-6'>
                        <InputLabel for="name" value="Nombre"></InputLabel>
                        <TextInput id="name" name="name" ref={NameInput}
                        value={data.name} required="required"
                        handleChange={(e)=> setData('name',e.target.value)}
                        className="mt-1 block w-3/4" isFocused></TextInput>
                        <InputError message={errors.name} className='mt-2'></InputError>
                    </div>
                    <div className='mt-6'>
                        <InputLabel for="description" value="Descripcion"></InputLabel>
                        <TextInput id="description" name="description" ref={DescriptionInput}
                        value={data.description} required="required"
                        handleChange={(e)=> setData('description',e.target.value)}
                        className="mt-1 block w-3/4"></TextInput>
                        <InputError message={errors.description} className='mt-2'></InputError>
                    </div>
                    <div className='mt-6'>
                        <InputLabel for="completed" value="Completada"></InputLabel>
                        <Checkbox id="completed" name="completed" ref={CompletedInput}
                        value={data.completed}
                        checked={data.completed}
                        handleChange={(e)=> setData('completed',e.target.checked)}
                        className="mt-1 block w-3/4"></Checkbox>
                        <InputError message={errors.completed} className='mt-2'></InputError>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal} className='mr-2'>Cancelar</SecondaryButton>
                        <PrimaryButton processing={processing}>
                            <i className='fa-solid fa-save'></i>Guardar
                        </PrimaryButton>

                    </div>
                </form>
            </Modal>

        </AuthenticatedLayout>
    );
}
