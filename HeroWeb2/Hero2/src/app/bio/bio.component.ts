import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Developer } from '../developer';
import { CommonModule } from '@angular/common';
import { DeveloperService } from '../developer.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit, OnDestroy {
  @Input() devs: Developer[] = [];  // Array of Developer
  selectedDeveloperId: string | null = null;  // Hold the currently selected developer ID
  private subscription!: Subscription;  // Store the subscription

  constructor(private devService: DeveloperService, private httpClient: HttpClient) {}

  ngOnInit() {
    console.log('BioComponent ngOnInit');

    // Load all developers when the component initializes
    this.loadDeveloper();

    // Subscribe to the selected developer ID from the DeveloperService
    this.subscription = this.devService.selectedDeveloperId$.subscribe(id => {
      this.selectedDeveloperId = id;
      console.log('ngOnInit bio component: Selected Developer ID:', id);
    });
  }

  // Unsubscribe to prevent memory leaks
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Load all developers from the service
  loadDeveloper() {
    this.devService.getAllDevelopers().subscribe(devs => {
      this.devs = devs;
    });
  }

  // When a developer is selected, update the selectedDeveloperId in the service
  selectDeveloper(id: string) {
    console.log('Selected Developer ID:', id);
    this.devService.setSelectedDeveloperId(id);  // Update the developer ID in the service
  }

  // Generate a nicely formatted description of the developer for the tooltip
  getDeveloperDescription(dev: Developer): string {
    return `${dev.firstName} ${dev.lastName}\nLanguage: ${dev.language}\nStart Year: ${dev.startYear}`;
  }
}
