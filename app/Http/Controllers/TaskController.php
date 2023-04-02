<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{

    public function index()
    {
        $user=auth()->user();
        $tasks = $user->tasks;
        return Inertia::render('Tasks/Index',['tasks'=>$tasks]);
    }
    // public function create()
    // {
    //     //
    // }
    public function store(Request $request)
    {
        $request->validate([
            'description'=>'required|min:5'
        ]);
        $task=new Task($request->input());
        empty($task->completed)? $task->completed=false:$task->completed=true;
        $task->name=$request->input('name');
        $task->user_id=auth()->user()->id;
        $task->save();
        return redirect('tasks');
    }
    // public function show(Task $task)
    // {
    //     //
    // }
    // public function edit(Task $task)
    // {
    //     //
    // }
    public function update(Request $request, $id)
    {
        $task=Task::find($id);
        $task->name=$request->input('name');
        $task->fill($request->input())->saveOrFail();
        return redirect('tasks');

    }


    public function destroy($id)
    {
        $task=Task::find($id);
        $task->delete();
        return redirect('tasks');
    }
}
