'use client';
import {useCateringPresenter} from '../presenters/useCateringPresenter';
import CateringView from '../views/CateringView';
export default function AdminPage() {return <CateringView showWelcome={false} presenter={useCateringPresenter({initialAdminOpen:true})} />;}
