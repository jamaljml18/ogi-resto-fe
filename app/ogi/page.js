'use client';
import {useCateringPresenter} from '../presenters/useCateringPresenter';
import CateringView from '../views/CateringView';
export default function AdminPage() {return <CateringView presenter={useCateringPresenter({initialAdminOpen:true})} />;}
