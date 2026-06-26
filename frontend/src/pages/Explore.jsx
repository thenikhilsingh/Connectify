import { useState } from "react";
import { Search, Heart, MessageCircle, UserPlus, Check, Clock } from "lucide-react";

export default function Explore() {
  const [tab, setTab] = useState("Posts");
  const posts=[{id:1,name:"Emma Watson",time:"2 hrs ago",text:"Enjoying the mountains 🌄",image:"https://picsum.photos/800/450?1",likes:234,comments:19},{id:2,name:"Noah Brown",time:"5 hrs ago",text:"Late night coding ☕",image:"https://picsum.photos/800/450?2",likes:143,comments:8}];
  const people=[{id:1,name:"Emma Watson",bio:"Frontend Developer",status:"add"},{id:2,name:"Noah Brown",bio:"Backend Engineer",status:"pending"},{id:3,name:"Olivia Davis",bio:"UI/UX Designer",status:"friends"},{id:4,name:"James Taylor",bio:"Full Stack Developer",status:"add"},{id:5,name:"Sophia Lee",bio:"React Developer",status:"add"},{id:6,name:"William Scott",bio:"MERN Developer",status:"friends"}];
  const renderButton=(s)=> s==="add"?<button className="mt-4 w-full bg-violet-600 text-white rounded-xl py-2 flex justify-center gap-2"><UserPlus size={18}/>Add Friend</button>:s==="pending"?<button className="mt-4 w-full bg-yellow-100 text-yellow-700 rounded-xl py-2 flex justify-center gap-2"><Clock size={18}/>Request Sent</button>:<button className="mt-4 w-full bg-green-100 text-green-700 rounded-xl py-2 flex justify-center gap-2"><Check size={18}/>Friends</button>;
  return (
  <div className="bg-[#f5f7fb] min-h-screen p-6">
   <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Explore</h1>
      <div className="relative w-[420px]">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-400"/>
        <input className="w-full border rounded-xl pl-11 py-3 pr-4" placeholder="Search posts or people..."/>
      </div>
    </div>
    <div className="flex gap-8 mt-8 border-b">
      {["Posts","People"].map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?"pb-4 font-semibold text-violet-600 border-b-4 border-violet-600":"pb-4 font-semibold text-gray-500"}>{t}</button>)}
    </div>
    {tab==="Posts" && <div className="space-y-6 mt-8">{posts.map(p=><div key={p.id} className="border rounded-2xl overflow-hidden"><div className="p-5"><div className="flex gap-3 items-center"><img src={`https://i.pravatar.cc/100?img=${p.id+10}`} className="w-12 h-12 rounded-full"/><div><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-gray-500">{p.time}</p></div></div><p className="mt-4">{p.text}</p></div><img src={p.image} className="w-full h-96 object-cover"/><div className="flex justify-between p-5 border-t"><button className="flex gap-2"><Heart size={18}/>{p.likes}</button><button className="flex gap-2"><MessageCircle size={18}/>{p.comments}</button></div></div>)}</div>}
    {tab==="People" && <div className="grid grid-cols-3 gap-6 mt-8">{people.map((person,i)=><div key={person.id} className="border rounded-2xl p-5 hover:shadow-lg"><img src={`https://i.pravatar.cc/300?img=${i+20}`} className="w-24 h-24 rounded-full mx-auto"/><h3 className="text-center text-xl font-semibold mt-4">{person.name}</h3><p className="text-center text-gray-500">{person.bio}</p><p className="text-center text-sm text-gray-400 mt-2">{i+6} mutual friends</p>{renderButton(person.status)}</div>)}</div>}
   </div>
  </div>);
}
