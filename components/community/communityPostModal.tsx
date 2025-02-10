import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreatePostCommunityForm from '../post/CreatePostCommunityForm';


interface Props {
    communityId: string;
}
const CommunityPostModal = ({ communityId }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Écrire un article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel article</DialogTitle>
          <DialogDescription>
            Partagez vos idées avec la communauté
          </DialogDescription>
        </DialogHeader>
        <CreatePostCommunityForm communityId={communityId} />
      </DialogContent>
    </Dialog>
  );
};

export default CommunityPostModal;