import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  album: {};
  paramSubscription: Subscription;

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private musicData: MusicDataService
  ) {}

  ngOnInit(): void {
    // this.album = (data as any).default;
    this.paramSubscription = this.route.params.subscribe((params: Params) =>
      this.musicData
        .getAlbumById(params.id)
        .subscribe((data) => (this.album = data))
    );
  }

  addToFavourites(trackID: string) {
    this.musicData.addToFavourites(trackID)
      ? this.snackBar.open('Adding to Favourites...', 'Done', {
          duration: 1500,
        })
      : null;
  }
}
