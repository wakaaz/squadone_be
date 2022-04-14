<?php

namespace App\Http\Controllers;

use App\FAQ;
use Illuminate\Http\Request;

class FAQController extends Controller
{
    public function index()
    {
        $faqs = FAQ::all();
        return view('faq.index' , compact('faqs'));
    }
    public function store(Request $req , $id=null){
        $question = $req->question;
        $awnser   = $req->awnser ; 
        if($id){
            $faq = FAQ::find($id);  
        }
        if(!$id){
            $faq = new FAQ();
        }
        $faq->question = $question;
        $faq->answer = $awnser;
        if($faq->save()){
            return "success";
        }else{
            return "failed";
        }
        
    }
    public function faqs(){
        $faqs =  FAQ::all();
        return $faqs;
    }
    public function get_faq($id){
        $faq = FAQ::find($id);
        return $faq;
    }
    public function delete_faq($id){
        $faq = FAQ::find($id);
        if($faq->delete()){
            return "success";
        }
        else{
            return "failed";
        }
    }
}
