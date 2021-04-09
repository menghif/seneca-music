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
  trackPreviews: Array<string> = [];
  favourites: Array<any>;
  paramSubscription: Subscription;

  constructor(
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private musicData: MusicDataService
  ) {}

  ngOnInit(): void {
    this.getFavourites();
    this.paramSubscription = this.route.params.subscribe((params: Params) =>
      this.musicData.getAlbumById(params.id).subscribe((data) => {
        data.tracks.items.forEach((track) => {
          this.trackPreviews.push(track.preview_url);
        });
        this.album = data;
      })
    );
  }

  addToFavourites(trackID: string) {
    this.musicData.addToFavourites(trackID).subscribe(
      () => {
        this.getFavourites();
        this.snackBar.open('Added to Favourites', 'Done', {
          duration: 1000,
        });
      },
      (err) => {
        this.snackBar.open('Unable to add song to Favourites', null, {
          duration: 1000,
        });
      }
    );
  }

  removeFromFavourites(trackID: string) {
    this.musicData.removeFromFavourites(trackID).subscribe(
      () => {
        this.getFavourites();
        this.snackBar.open('Removed from Favourites', 'Done', {
          duration: 1000,
        });
      },
      (err) => {
        this.snackBar.open('Unable to remove song from Favourites', null, {
          duration: 1000,
        });
      }
    );
  }

  getFavourites(): void {
    this.musicData
      .getFavourites()
      .subscribe((data) => (this.favourites = data.tracks));
  }

  isFavourite(trackID: string): Boolean {
    return this.favourites
      ? this.favourites.find((el) => el.id === trackID)
      : false;
  }

  handlePreviewError(): void {
    this.trackPreviews = [];
  }
}
